import { Effect } from "effect"
import path from "node:path"
import { ArchitectureDiscoveryError } from "../core/errors.js"
import { projectsDirectory, rootDirectory } from "../core/paths.js"
import { decodeYaml } from "../core/yaml.js"
import { FileStore } from "../core/workspace.js"
import { ProjectManifestSchema, type ProjectManifest } from "../projects/schema.js"
import {
  classifyTrackedPath,
  generatedSiteNode,
  makeManifestNode,
  makeSourceNode,
  renderedSiteNode
} from "./catalog.js"
import type { ArchitectureEdge, ArchitectureGraph, ArchitectureNode } from "./schema.js"

type DiscoveredFile = {
  readonly absolutePath: string
  readonly relativePath: string
}

const architectureRoots = [
  "tools/src",
  "packages/ui/src",
  "packages/theme/src",
  "site-src"
] as const

const trackedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".scss", ".css", ".html", ".md", ".yml"])

const relativeImportPattern = /from\s+["'](\.[^"']+)["']|import\s*\(["'](\.[^"']+)["']\)/g

const pathExists = (value: string) =>
  Effect.tryPromise({
    try: async () => {
      const fs = await import("node:fs/promises")
      await fs.access(value)
      return true
    },
    catch: () => false
  })

const readTree = (directory: string): Effect.Effect<ReadonlyArray<DiscoveredFile>, Error, FileStore> =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const entries = yield* fileStore.readDirectory(directory)
    const nested = yield* Effect.forEach(entries, (entry) => {
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        return readTree(absolutePath)
      }

      return trackedExtensions.has(path.extname(entry.name))
        ? Effect.succeed([{ absolutePath, relativePath: path.relative(rootDirectory, absolutePath) }] as const)
        : Effect.succeed([] as const)
    }, { concurrency: 8 })

    return nested.flat()
  })

const loadProjectManifests = Effect.gen(function* () {
  const fileStore = yield* FileStore
  const entries = yield* fileStore.readDirectory(projectsDirectory)
  const manifestFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))

  return yield* Effect.forEach(manifestFiles, (entry) =>
    fileStore.readText(path.join(projectsDirectory, entry.name)).pipe(
      Effect.flatMap((content) => decodeYaml(`Unable to decode project manifest '${entry.name}'`, content, ProjectManifestSchema))
    )
  )
})

const resolveImportTarget = async (fromPath: string, specifier: string): Promise<string | null> => {
  const fs = await import("node:fs/promises")
  const basePath = path.resolve(path.dirname(path.join(rootDirectory, fromPath)), specifier)
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.scss`,
    `${basePath}.css`,
    `${basePath}.html`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js")
  ]

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate)
      if (stats.isFile()) {
        return path.relative(rootDirectory, candidate)
      }
    } catch {
      continue
    }
  }

  return null
}

const dedupeBy = <A>(values: ReadonlyArray<A>, keyOf: (value: A) => string): ReadonlyArray<A> =>
  Array.from(new Map(values.map((value) => [keyOf(value), value])).values())

const discoverImportEdges = (
  files: ReadonlyArray<DiscoveredFile>,
  manifests: ReadonlyArray<ProjectManifest>
): Effect.Effect<ReadonlyArray<ArchitectureEdge>, Error, FileStore> =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const knownFiles = new Set(files.map((file) => file.relativePath))

    const rawEdges = yield* Effect.forEach(files, (file) =>
      fileStore.readText(file.absolutePath).pipe(
        Effect.flatMap((content) =>
          Effect.promise(async () => {
            const imports = Array.from(content.matchAll(relativeImportPattern))
              .map((match) => match[1] ?? match[2])
              .filter((value): value is string => Boolean(value))

            const resolvedTargets = await Promise.all(imports.map((specifier) => resolveImportTarget(file.relativePath, specifier)))

            return resolvedTargets
              .filter((target): target is string => typeof target === "string")
              .filter((target) => knownFiles.has(target))
              .map((target) => ({
                from: classifyTrackedPath(file.relativePath, manifests).id,
                to: classifyTrackedPath(target, manifests).id,
                label: "imports",
                kind: "dependency" as const
              }))
          })
        )
      ),
    { concurrency: 8 })

    return dedupeBy(rawEdges.flat().filter((edge) => edge.from !== edge.to), (edge) => `${edge.from}:${edge.to}:${edge.label}:${edge.kind}`)
  })

const makeFlowEdges = (manifests: ReadonlyArray<ProjectManifest>): ReadonlyArray<ArchitectureEdge> => [
  { from: "cli", to: "tools-programs", label: "dispatches", kind: "flow" },
  { from: "tools-programs", to: "tools-core", label: "uses", kind: "flow" },
  { from: "tools-programs", to: "tools-architecture", label: "refreshes docs with", kind: "flow" },
  { from: "tools-programs", to: "tools-projects", label: "loads", kind: "flow" },
  { from: "package-theme", to: "generated-site", label: "copies into", kind: "flow" },
  { from: "site-src", to: "generated-site", label: "copies into", kind: "flow" },
  { from: "package-ui", to: "generated-site", label: "bundles into", kind: "flow" },
  { from: "generated-site", to: "rendered-site", label: "builds", kind: "flow" },
  ...manifests.flatMap((manifest) => {
    const projectId = `project-${manifest.slug}`
    const manifestId = `manifest-${manifest.slug}`
    const sourceId = `source-${manifest.slug}`

    return [
      { from: manifestId, to: sourceId, label: "points to", kind: "flow" as const },
      { from: manifestId, to: projectId, label: "configures", kind: "flow" as const },
      { from: sourceId, to: projectId, label: "feeds", kind: "flow" as const },
      { from: projectId, to: "generated-site", label: "emits pages/data", kind: "flow" as const }
    ]
  })
]

const makeDiscoveredNodes = (
  files: ReadonlyArray<DiscoveredFile>,
  manifests: ReadonlyArray<ProjectManifest>
): ReadonlyArray<ArchitectureNode> => {
  const counts = new Map<string, { readonly node: ArchitectureNode; count: number }>()

  for (const file of files) {
    const node = classifyTrackedPath(file.relativePath, manifests)
    const existing = counts.get(node.id)
    counts.set(node.id, existing ? { node: existing.node, count: existing.count + 1 } : { node, count: 1 })
  }

  return Array.from(counts.values()).map(({ node, count }) => ({
    ...node,
    detail: `${node.detail} · ${count} tracked file${count === 1 ? "" : "s"}`
  }))
}

const makeDynamicNodes = (manifests: ReadonlyArray<ProjectManifest>): ReadonlyArray<ArchitectureNode> => [
  ...manifests.flatMap((manifest) => [makeManifestNode(manifest), makeSourceNode(manifest)]),
  generatedSiteNode,
  renderedSiteNode
]

export const discoverArchitectureGraph = Effect.gen(function* () {
  const manifests = yield* loadProjectManifests
  const discoveredTrees = yield* Effect.forEach(architectureRoots, (relativePath) => {
    const absolutePath = path.join(rootDirectory, relativePath)
    return pathExists(absolutePath).pipe(
      Effect.flatMap((exists) => exists ? readTree(absolutePath) : Effect.succeed([]))
    )
  }, { concurrency: 4 })

  const files = discoveredTrees.flat()
  const nodes = dedupeBy([...makeDiscoveredNodes(files, manifests), ...makeDynamicNodes(manifests)], (node) => node.id)
  const edges = dedupeBy(
    [...makeFlowEdges(manifests), ...(yield* discoverImportEdges(files, manifests))],
    (edge) => `${edge.from}:${edge.to}:${edge.label}:${edge.kind}`
  )

  if (!nodes.length) {
    return yield* Effect.fail(new ArchitectureDiscoveryError({ reason: "No architecture nodes were discovered" }))
  }

  return { nodes, edges } satisfies ArchitectureGraph
})
