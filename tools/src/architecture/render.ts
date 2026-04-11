import { chromium } from "@playwright/test"
import { build } from "esbuild"
import { Effect } from "effect"
import path from "node:path"
import { DiagramRenderError } from "../core/errors.js"
import { rootDirectory } from "../core/paths.js"
import type { ArchitectureDiagram, ArchitectureNode } from "./schema.js"

const bundleRenderer = (diagramId: string) =>
  Effect.tryPromise({
    try: async () => {
      const result = await build({
        entryPoints: [path.join(rootDirectory, "tools/src/architecture/browser-renderer.ts")],
        bundle: true,
        write: false,
        format: "iife",
        platform: "browser",
        target: "es2022"
      })

      const output = result.outputFiles?.[0]?.text
      if (!output) {
        throw new Error("Renderer bundle was empty")
      }

      return output
    },
    catch: (error) => new DiagramRenderError({ diagram: diagramId, reason: String(error) })
  })

export const renderMermaidToExcalidraw = (
  diagram: ArchitectureDiagram,
  mermaid: string,
  nodes: ReadonlyArray<ArchitectureNode>
) =>
  Effect.gen(function* () {
    const bundle = yield* bundleRenderer(diagram.id)
    const browser = yield* Effect.acquireRelease(
      Effect.tryPromise({
        try: () => chromium.launch({ headless: true }),
        catch: (error) => new DiagramRenderError({ diagram: diagram.id, reason: String(error) })
      }),
      (instance) => Effect.promise(() => instance.close().catch(() => undefined))
    )
    const page = yield* Effect.acquireRelease(
      Effect.tryPromise({
        try: () => browser.newPage(),
        catch: (error) => new DiagramRenderError({ diagram: diagram.id, reason: String(error) })
      }),
      (instance) => Effect.promise(() => instance.close().catch(() => undefined))
    )

    yield* Effect.tryPromise({
      try: () => page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>${bundle}</script></body></html>`, { waitUntil: "load" }),
      catch: (error) => new DiagramRenderError({ diagram: diagram.id, reason: String(error) })
    })

    return yield* Effect.tryPromise({
      try: () => page.evaluate(async (payload) => {
        if (!window.__renderArchitectureDiagram) {
          throw new Error("Architecture renderer was not installed")
        }

        return window.__renderArchitectureDiagram(payload)
      }, { mermaid, diagram, nodes }),
      catch: (error) => new DiagramRenderError({ diagram: diagram.id, reason: String(error) })
    })
  })
