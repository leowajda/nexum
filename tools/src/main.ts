import { Command } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { generateSite } from "./programs/generate.js"

const generate = Command.make("generate", {}, () => generateSite)

const root = Command.make("leowajda.github.io", {}, () => Effect.void).pipe(
  Command.withSubcommands([generate])
)

const cli = Command.run(root, {
  name: "leowajda.github.io",
  version: "v0.1.0"
})

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
