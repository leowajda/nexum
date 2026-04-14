import { Effect, Layer } from "effect"
import { buildBrowserAssets } from "../core/asset-pipeline.js"
import { WorkspaceLive } from "../core/workspace.js"
import { buildProjects } from "../projects/builds.js"
import { writeProjectBuildOutputs } from "../projects/output.js"
import { ProjectAdapterRegistryLive } from "../projects/registry.js"
import { clearGeneratedOutputs, writeGeneratedOutputsManifest } from "./generated-site.js"

const program = Effect.gen(function* () {
  yield* clearGeneratedOutputs
  const builds = yield* buildProjects
  const projectOutputFiles = yield* writeProjectBuildOutputs(builds)
  const browserAssetFiles = yield* buildBrowserAssets
  yield* writeGeneratedOutputsManifest([...projectOutputFiles, ...browserAssetFiles])
})

export const generateSite = program.pipe(Effect.provide(Layer.mergeAll(ProjectAdapterRegistryLive, WorkspaceLive)))
