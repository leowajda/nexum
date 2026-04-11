import { Effect, Layer, Schema } from "effect"
import path from "node:path"
import { buildBrowserAssets } from "../core/assets.js"
import { decodeYaml, encodeYaml } from "../core/yaml.js"
import { FileStore, WorkspaceLive } from "../core/workspace.js"
import { generatedSiteDirectory, projectsDirectory, siteSourceDirectory, themeSourceDirectory } from "../core/paths.js"
import { ProjectAdapterRegistry, ProjectAdapterRegistryLive } from "../projects/registry.js"
import { ProjectManifestSchema } from "../projects/schema.js"
import { ProjectRegistryError } from "../core/errors.js"
import { ProjectCardSchema, type ProjectBuild } from "../projects/types.js"

const ProjectsSchema = Schema.Array(ProjectCardSchema)

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

const writeBuildOutputs = (builds: ReadonlyArray<ProjectBuild>) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const files = builds.flatMap((build) => build.files)
    const projectsYaml = yield* encodeYaml("Unable to encode generated project index", ProjectsSchema, builds.map((build) => build.card))

    yield* Effect.forEach(files, (file) => fileStore.writeText(file.path, file.content), { concurrency: 8 })
    yield* fileStore.writeText(path.join(generatedSiteDirectory, "_data/generated/projects.yml"), projectsYaml)
  })

const buildProjects = Effect.gen(function* () {
  const manifests = yield* loadProjectManifests
  const { adapters } = yield* ProjectAdapterRegistry

  return yield* Effect.forEach(manifests, (manifest) => {
    const adapter = adapters[manifest.kind]
    return adapter
      ? adapter.build(manifest)
      : Effect.fail(new ProjectRegistryError({ kind: manifest.kind }))
  }, { concurrency: 4 })
})

const program = Effect.gen(function* () {
  const fileStore = yield* FileStore

  yield* fileStore.removeDirectory(generatedSiteDirectory)
  yield* fileStore.copyDirectoryContents(themeSourceDirectory, generatedSiteDirectory)
  yield* fileStore.copyDirectoryContents(siteSourceDirectory, generatedSiteDirectory)

  const builds = yield* buildProjects
  yield* writeBuildOutputs(builds)
  yield* buildBrowserAssets
})

export const generateSite = program.pipe(Effect.provide(Layer.mergeAll(ProjectAdapterRegistryLive, WorkspaceLive)))
