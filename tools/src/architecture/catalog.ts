import type { ProjectManifest } from "../projects/schema.js"
import type { ArchitectureGroup, ArchitectureNode } from "./schema.js"

type StaticModuleDefinition = {
  readonly id: string
  readonly label: string
  readonly group: ArchitectureGroup
  readonly detail: string
  readonly match:
    | { readonly kind: "exact"; readonly value: string }
    | { readonly kind: "prefix"; readonly value: string }
}

type DynamicModuleDefinition = {
  readonly kind: "project_adapter"
  readonly prefix: string
}

export const architectureGroupTitles: Readonly<Record<ArchitectureGroup, string>> = {
  source_repos: "Source Repos",
  project_manifests: "Project Manifests",
  tools: "Tools",
  packages: "Packages",
  site: "Site",
  other: "Other"
}

export const architectureGroupPalette: Readonly<Record<ArchitectureGroup, { readonly stroke: string; readonly fill: string; readonly text: string }>> = {
  source_repos: { stroke: "#c2410c", fill: "#ffedd5", text: "#9a3412" },
  project_manifests: { stroke: "#a16207", fill: "#fef3c7", text: "#854d0e" },
  tools: { stroke: "#2563eb", fill: "#dbeafe", text: "#1d4ed8" },
  packages: { stroke: "#7c3aed", fill: "#ede9fe", text: "#6d28d9" },
  site: { stroke: "#059669", fill: "#d1fae5", text: "#047857" },
  other: { stroke: "#64748b", fill: "#e2e8f0", text: "#334155" }
}

const staticModuleDefinitions: ReadonlyArray<StaticModuleDefinition> = [
  {
    id: "cli",
    label: "CLI",
    group: "tools",
    detail: "command entrypoint",
    match: { kind: "exact", value: "tools/src/main.ts" }
  },
  {
    id: "tools-core",
    label: "tools/core",
    group: "tools",
    detail: "effects, io, paths, preview server",
    match: { kind: "prefix", value: "tools/src/core/" }
  },
  {
    id: "tools-architecture",
    label: "tools/architecture",
    group: "tools",
    detail: "graph discovery + diagram specs",
    match: { kind: "prefix", value: "tools/src/architecture/" }
  },
  {
    id: "tools-programs",
    label: "tools/programs",
    group: "tools",
    detail: "generate, preview, docs, sync",
    match: { kind: "prefix", value: "tools/src/programs/" }
  },
  {
    id: "tools-projects",
    label: "tools/projects",
    group: "tools",
    detail: "shared project contracts + registry",
    match: { kind: "prefix", value: "tools/src/projects/" }
  },
  {
    id: "package-ui",
    label: "packages/ui",
    group: "packages",
    detail: "browser controllers + icons",
    match: { kind: "prefix", value: "packages/ui/" }
  },
  {
    id: "package-theme",
    label: "packages/theme",
    group: "packages",
    detail: "shared layouts, includes, sass",
    match: { kind: "prefix", value: "packages/theme/" }
  },
  {
    id: "site-src",
    label: "site-src",
    group: "site",
    detail: "repo-authored site content",
    match: { kind: "prefix", value: "site-src/" }
  }
]

const dynamicModuleDefinitions: ReadonlyArray<DynamicModuleDefinition> = [
  { kind: "project_adapter", prefix: "tools/src/projects/" }
]

const matchesDefinition = (definition: StaticModuleDefinition, relativePath: string) =>
  definition.match.kind === "exact"
    ? relativePath === definition.match.value
    : relativePath.startsWith(definition.match.value)

const findProjectManifest = (manifests: ReadonlyArray<ProjectManifest>, slug: string) =>
  manifests.find((manifest) => manifest.slug === slug || manifest.kind === slug)

export const classifyTrackedPath = (
  relativePath: string,
  manifests: ReadonlyArray<ProjectManifest>
): ArchitectureNode => {
  const projectAdapterRule = dynamicModuleDefinitions.find((definition) =>
    definition.kind === "project_adapter" && relativePath.startsWith(definition.prefix)
  )

  if (projectAdapterRule) {
    const projectSegment = relativePath.slice(projectAdapterRule.prefix.length).split("/")[0]
    const manifest = projectSegment ? findProjectManifest(manifests, projectSegment) : undefined
    if (manifest) {
      return {
        id: `project-${manifest.slug}`,
        label: `project:${manifest.slug}`,
        group: "tools",
        detail: `${manifest.kind} adapter + model`
      }
    }

    return {
      id: "tools-projects",
      label: "tools/projects",
      group: "tools",
      detail: "shared project contracts + registry"
    }
  }

  const staticMatch = staticModuleDefinitions.find((definition) => matchesDefinition(definition, relativePath))
  if (staticMatch) {
    return {
      id: staticMatch.id,
      label: staticMatch.label,
      group: staticMatch.group,
      detail: staticMatch.detail
    }
  }

  return {
    id: "other",
    label: "other",
    group: "other",
    detail: "unclassified tracked files"
  }
}

export const makeManifestNode = (manifest: ProjectManifest): ArchitectureNode => ({
  id: `manifest-${manifest.slug}`,
  label: `manifest:${manifest.slug}`,
  group: "project_manifests",
  detail: `projects/${manifest.slug}.yml`
})

export const makeSourceNode = (manifest: ProjectManifest): ArchitectureNode => ({
  id: `source-${manifest.slug}`,
  label: `source:${manifest.slug}`,
  group: "source_repos",
  detail: manifest.source_repo_path
})

export const generatedSiteNode: ArchitectureNode = {
  id: "generated-site",
  label: "generated site",
  group: "site",
  detail: "site/"
}

export const renderedSiteNode: ArchitectureNode = {
  id: "rendered-site",
  label: "rendered site",
  group: "site",
  detail: "_site/"
}
