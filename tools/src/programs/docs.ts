import { Effect } from "effect"
import fs from "node:fs/promises"
import path from "node:path"
import { rootDirectory } from "../core/paths.js"

const readmePath = path.join(rootDirectory, "README.md")
const agentsPath = path.join(rootDirectory, "AGENTS.md")

export const refreshDocs = Effect.tryPromise({
  try: async () => {
    try {
      const existing = await fs.readlink(readmePath)
      if (existing === "AGENTS.md") {
        return
      }
    } catch {
      // README is missing or not a symlink; replace it below.
    }

    await fs.rm(readmePath, { force: true })
    await fs.symlink(path.basename(agentsPath), readmePath)
  },
  catch: (error) => error as Error
})
