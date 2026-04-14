import { Effect, Schema } from "effect"
import path from "node:path"
import { jekyllSourceDirectory } from "../core/paths.js"
import { FileStore } from "../core/workspace.js"
import { encodeYaml } from "../core/yaml.js"
import { ProjectCardSchema, type ProjectBuild } from "./types.js"

const ProjectsSchema = Schema.Array(ProjectCardSchema)

export const writeProjectBuildOutputs = (builds: ReadonlyArray<ProjectBuild>) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const files = builds.flatMap((build) => build.files)
    const assets = builds.flatMap((build) => build.assets)
    const projectsYamlPath = path.join(jekyllSourceDirectory, "_data/generated/projects.yml")
    const projectsYaml = yield* encodeYaml(
      "Unable to encode generated project index",
      ProjectsSchema,
      builds.map((build) => build.card)
    )

    yield* Effect.forEach(files, (file) => fileStore.writeText(file.path, file.content), { concurrency: 8 })
    yield* Effect.forEach(assets, (asset) => fileStore.copyFile(asset.source_path, asset.target_path), { concurrency: 8 })
    yield* fileStore.writeText(projectsYamlPath, projectsYaml)

    return [
      ...files.map((file) => file.path),
      ...assets.map((asset) => asset.target_path),
      projectsYamlPath
    ]
  })
