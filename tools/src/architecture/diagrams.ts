import type { ArchitectureDiagram, ArchitectureGraph } from "./schema.js"

const diagram = (value: ArchitectureDiagram) => value

export const buildArchitectureDiagrams = (graph: ArchitectureGraph): ReadonlyArray<ArchitectureDiagram> => {
  const hasNode = (id: string) => graph.nodes.some((node) => node.id === id)
  const maybe = (id: string) => hasNode(id) ? [id] : []

  return [
    diagram({
      id: "repository-overview",
      title: "Repository Overview",
      mermaidDirection: "LR",
      nodeIds: graph.nodes.map((node) => node.id),
      annotations: [
        {
          id: "overview-source",
          target: "source-eureka",
          text: "Upstream source of truth:\nlanguages + problems live here",
          placement: "left",
          tone: "source_repos"
        },
        {
          id: "overview-generated",
          target: "generated-site",
          text: "Generated pages, data files,\nand browser bundle land here",
          placement: "bottom",
          tone: "site"
        }
      ]
    }),
    diagram({
      id: "eureka-pipeline",
      title: "Eureka Pipeline",
      mermaidDirection: "LR",
      nodeIds: [
        ...maybe("source-eureka"),
        ...maybe("manifest-eureka"),
        ...maybe("project-eureka"),
        ...maybe("tools-programs"),
        ...maybe("package-ui"),
        ...maybe("site-src"),
        ...maybe("generated-site"),
        ...maybe("rendered-site")
      ],
      annotations: [
        {
          id: "pipeline-source",
          target: "source-eureka",
          text: "Source repo merged by upstream automation",
          placement: "top",
          tone: "source_repos"
        },
        {
          id: "pipeline-adapter",
          target: "project-eureka",
          text: "Effect schemas decode YAML\nand project build emits site artifacts",
          placement: "bottom",
          tone: "tools"
        }
      ]
    })
  ]
}
