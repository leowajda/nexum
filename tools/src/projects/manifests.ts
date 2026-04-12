import { Effect } from "effect"
import path from "node:path"
import { projectsDirectory } from "../core/paths.js"
import { FileStore } from "../core/workspace.js"
import { decodeYaml } from "../core/yaml.js"
import { ProjectManifestSchema, type ProjectManifest } from "./schema.js"

const isManifestFile = (entry: { readonly isFile: () => boolean; readonly name: string }) =>
  entry.isFile() && entry.name.endsWith(".yml")

const byName = (left: { readonly name: string }, right: { readonly name: string }) =>
  left.name.localeCompare(right.name)

export const loadProjectManifests: Effect.Effect<ReadonlyArray<ProjectManifest>, Error, FileStore> = Effect.gen(function* () {
  const fileStore = yield* FileStore
  const entries = yield* fileStore.readDirectory(projectsDirectory)
  const manifestFiles = entries.filter(isManifestFile).sort(byName)

  return yield* Effect.forEach(manifestFiles, (entry) =>
    fileStore.readText(path.join(projectsDirectory, entry.name)).pipe(
      Effect.flatMap((content) => decodeYaml(`Unable to decode project manifest '${entry.name}'`, content, ProjectManifestSchema))
    )
  )
})
