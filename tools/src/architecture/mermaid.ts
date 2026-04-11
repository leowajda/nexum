import type { ArchitectureDiagram, ArchitectureGraph, ArchitectureNode } from "./schema.js"

export const diagramElementId = (value: string) => value.replace(/[^a-zA-Z0-9_]/g, "_")

const escapeLabel = (value: string) => value.replace(/"/g, "'")

const shapeForNode = (node: ArchitectureNode) => {
  if (node.group === "source_repos") {
    return `{${escapeLabel(node.label)}}`
  }
  if (node.group === "project_manifests") {
    return `(${escapeLabel(node.label)})`
  }
  if (node.id === "rendered-site") {
    return `([${escapeLabel(node.label)}])`
  }
  return `[${escapeLabel(node.label)}]`
}

export const renderArchitectureMermaid = (graph: ArchitectureGraph, diagram: ArchitectureDiagram) => {
  const includedNodes = new Set(diagram.nodeIds)
  const nodes = graph.nodes.filter((node) => includedNodes.has(node.id))
  const edges = graph.edges.filter((edge) => includedNodes.has(edge.from) && includedNodes.has(edge.to) && edge.kind === "flow")
  const lines = [`flowchart ${diagram.mermaidDirection}`]

  for (const node of nodes) {
    lines.push(`  ${diagramElementId(node.id)}${shapeForNode(node)}`)
  }

  for (const edge of edges) {
    lines.push(`  ${diagramElementId(edge.from)} -->|${escapeLabel(edge.label)}| ${diagramElementId(edge.to)}`)
  }

  return lines.join("\n")
}
