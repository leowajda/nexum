import { Effect } from "effect"
import { spawn } from "node:child_process"
import { jekyllSourceDirectory, rootDirectory } from "./paths.js"
import { previewHost, previewPort } from "./preview.js"

export const startJekyllPreview = Effect.acquireRelease(
  Effect.try({
    try: () => spawn("bundle", [
      "exec",
      "jekyll",
      "serve",
      "--source",
      jekyllSourceDirectory,
      "--destination",
      "_site",
      "--host",
      previewHost,
      "--port",
      String(previewPort),
      "--livereload",
      "--livereload-port",
      "35730"
    ], {
      cwd: rootDirectory,
      stdio: "inherit"
    }),
    catch: (error) => new Error(`Unable to start preview server: ${String(error)}`)
  }),
  (child) =>
    Effect.sync(() => {
      child.kill("SIGTERM")
    })
)
