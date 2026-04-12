import { Effect } from "effect"
import path from "node:path"
import { ProjectRegistryError, ProjectSourceMissingError } from "../core/errors.js"
import { rootDirectory } from "../core/paths.js"
import { FileStore } from "../core/workspace.js"
import { ProjectAdapterRegistry } from "./registry.js"
import type { ProjectManifest } from "./schema.js"
import type { ProjectAdapter, ProjectBuild } from "./types.js"
import { loadProjectManifests } from "./manifests.js"

const resolveProjectAdapter = (
  adapters: Readonly<Record<string, ProjectAdapter>>,
  manifest: ProjectManifest
) => {
  const adapter = adapters[manifest.kind]

  return adapter
    ? Effect.succeed(adapter)
    : Effect.fail(new ProjectRegistryError({ kind: manifest.kind }))
}

const requireProjectSource = (manifest: ProjectManifest) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const sourcePath = path.join(rootDirectory, manifest.source_repo_path)
    const exists = yield* fileStore.fileExists(sourcePath)

    if (!exists && manifest.source_optional) {
      return null
    }

    if (!exists) {
      return yield* Effect.fail(new ProjectSourceMissingError({
        slug: manifest.slug,
        sourcePath
      }))
    }

    return sourcePath
  })

const buildProject = (
  adapters: Readonly<Record<string, ProjectAdapter>>,
  manifest: ProjectManifest
) =>
  Effect.gen(function* () {
    const sourcePath = yield* requireProjectSource(manifest)
    if (sourcePath === null) {
      return null
    }

    const adapter = yield* resolveProjectAdapter(adapters, manifest)
    return yield* adapter.build(manifest)
  })

export const buildProjects = Effect.gen(function* () {
  const manifests = yield* loadProjectManifests
  const { adapters } = yield* ProjectAdapterRegistry

  return yield* Effect.forEach(manifests, (manifest) => buildProject(adapters, manifest), {
    concurrency: 4
  }).pipe(
    Effect.map((builds) => builds.filter((build): build is ProjectBuild => build !== null))
  )
})
