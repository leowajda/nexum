import { Schema } from "effect"

export const ArchitectureGroupSchema = Schema.Literal(
  "source_repos",
  "project_manifests",
  "tools",
  "packages",
  "site",
  "other"
)

export const ArchitectureNodeSchema = Schema.Struct({
  id: Schema.String,
  label: Schema.String,
  group: ArchitectureGroupSchema,
  detail: Schema.String
})

export const ArchitectureEdgeSchema = Schema.Struct({
  from: Schema.String,
  to: Schema.String,
  label: Schema.String,
  kind: Schema.Literal("flow", "dependency", "annotation")
})

export const ArchitectureGraphSchema = Schema.Struct({
  nodes: Schema.Array(ArchitectureNodeSchema),
  edges: Schema.Array(ArchitectureEdgeSchema)
})

export const DiagramPlacementSchema = Schema.Literal("top", "right", "bottom", "left")

export const DiagramAnnotationSchema = Schema.Struct({
  id: Schema.String,
  target: Schema.String,
  text: Schema.String,
  placement: DiagramPlacementSchema,
  tone: ArchitectureGroupSchema
})

export const ArchitectureDiagramSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  mermaidDirection: Schema.Literal("LR", "TB"),
  nodeIds: Schema.Array(Schema.String),
  annotations: Schema.Array(DiagramAnnotationSchema)
})

export type ArchitectureGroup = Schema.Schema.Type<typeof ArchitectureGroupSchema>
export type ArchitectureNode = Schema.Schema.Type<typeof ArchitectureNodeSchema>
export type ArchitectureEdge = Schema.Schema.Type<typeof ArchitectureEdgeSchema>
export type ArchitectureGraph = Schema.Schema.Type<typeof ArchitectureGraphSchema>
export type DiagramPlacement = Schema.Schema.Type<typeof DiagramPlacementSchema>
export type DiagramAnnotation = Schema.Schema.Type<typeof DiagramAnnotationSchema>
export type ArchitectureDiagram = Schema.Schema.Type<typeof ArchitectureDiagramSchema>
