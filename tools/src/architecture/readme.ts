import type { ArchitectureDiagram } from "./schema.js"

export const renderReadme = (diagrams: ReadonlyArray<ArchitectureDiagram>) => {
  const diagramBlocks = diagrams
    .map((diagram) => `![${diagram.title}](docs/generated/${diagram.id}.svg)`)
    .join("\n\n")

  return [
    "# leowajda.github.io",
    "",
    diagramBlocks,
    ""
  ].join("\n")
}
