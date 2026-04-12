import { Command, Options } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { GraphBuildSettings } from "./graph/mode.js"
import { refreshDocs } from "./programs/docs.js"
import { generateSite } from "./programs/generate.js"
import { previewSite } from "./programs/preview.js"
import { syncSources } from "./programs/sync.js"

const refreshGraphs = Options.boolean("refresh-graphs")

const docs = Command.make("docs", {}, () => refreshDocs)
const generate = Command.make("generate", { refreshGraphs }, ({ refreshGraphs }) =>
  generateSite.pipe(
    Effect.provide(GraphBuildSettings.layer(refreshGraphs ? "refresh" : "build"))
  )
)
const preview = Command.make("preview", {}, () => Effect.scoped(previewSite))
const sync = Command.make("sync-sources", {}, () => syncSources)

const root = Command.make("leowajda.github.io", {}, () => Effect.void).pipe(
  Command.withSubcommands([docs, generate, preview, sync])
)

const cli = Command.run(root, {
  name: "leowajda.github.io",
  version: "v0.1.0"
})

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
