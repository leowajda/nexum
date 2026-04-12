import { Effect, Layer } from "effect"
import { buildBrowserAssets } from "../core/asset-pipeline.js"
import { WorkspaceLive } from "../core/workspace.js"
import { buildProjects } from "../projects/builds.js"
import { writeProjectBuildOutputs } from "../projects/output.js"
import { ProjectAdapterRegistryLive } from "../projects/registry.js"
import { prepareGeneratedSiteDirectory } from "./generated-site.js"

const program = Effect.gen(function* () {
  yield* prepareGeneratedSiteDirectory
  const builds = yield* buildProjects
  yield* writeProjectBuildOutputs(builds)
  yield* buildBrowserAssets
})

export const generateSite = program.pipe(Effect.provide(Layer.mergeAll(ProjectAdapterRegistryLive, WorkspaceLive)))
