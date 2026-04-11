import { Command } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { generateSite } from "./programs/generate.js"
import { syncSources } from "./programs/sync.js"

const generate = Command.make("generate", {}, () => generateSite)
const sync = Command.make("sync-sources", {}, () => syncSources)

const root = Command.make("leowajda.github.io", {}, () => Effect.void).pipe(
  Command.withSubcommands([generate, sync])
)

const cli = Command.run(root, {
  name: "leowajda.github.io",
  version: "v0.1.0"
})

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
