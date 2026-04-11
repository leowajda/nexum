import { Effect } from "effect"
import path from "node:path"
import { buildArchitectureDiagrams } from "../architecture/diagrams.js"
import { discoverArchitectureGraph } from "../architecture/discover.js"
import { renderArchitectureMermaid } from "../architecture/mermaid.js"
import { renderReadme } from "../architecture/readme.js"
import { renderMermaidToExcalidraw } from "../architecture/render.js"
import { generatedDocsDirectory, rootDirectory } from "../core/paths.js"
import { FileStore, WorkspaceLive } from "../core/workspace.js"

const program = Effect.gen(function* () {
  const fileStore = yield* FileStore
  const graph = yield* discoverArchitectureGraph
  const diagrams = buildArchitectureDiagrams(graph)
  const renderedDiagrams = yield* Effect.forEach(diagrams, (diagram) => {
    const nodes = graph.nodes.filter((node) => diagram.nodeIds.includes(node.id))
    const mermaid = renderArchitectureMermaid(graph, diagram)

    return renderMermaidToExcalidraw(diagram, mermaid, nodes).pipe(
      Effect.map((rendered) => ({ diagram, mermaid, rendered }))
    )
  }, { concurrency: 1 })

  yield* fileStore.removeDirectory(generatedDocsDirectory)
  yield* fileStore.writeText(path.join(generatedDocsDirectory, "architecture.json"), JSON.stringify(graph, null, 2))
  yield* fileStore.writeText(path.join(rootDirectory, "README.md"), renderReadme(diagrams))

  yield* Effect.forEach(renderedDiagrams, ({ diagram, mermaid, rendered }) =>
    Effect.all([
      fileStore.writeText(path.join(generatedDocsDirectory, `${diagram.id}.mmd`), mermaid),
      fileStore.writeText(path.join(generatedDocsDirectory, `${diagram.id}.excalidraw.json`), rendered.scene),
      fileStore.writeText(path.join(generatedDocsDirectory, `${diagram.id}.svg`), rendered.svg)
    ]),
  { concurrency: 1 })
})

export const refreshDocs = program.pipe(Effect.provide(WorkspaceLive))
