import { Effect } from "effect"
import { rootDirectory } from "../core/paths.js"
import { GitClient, WorkspaceLive } from "../core/workspace.js"

const program = Effect.gen(function* () {
  const gitClient = yield* GitClient
  yield* gitClient.updateSubmodules(rootDirectory)
})

export const syncSources = program.pipe(Effect.provide(WorkspaceLive))
