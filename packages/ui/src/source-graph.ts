import { Context, Effect, Layer, Schema } from "effect"
import { Browser, type Cleanup, combineCleanups } from "./browser"
import { mountForceGraph } from "./source-graph-renderer"

const SourceGraphNodeSchema = Schema.Struct({
  id: Schema.String,
  label: Schema.String,
  url: Schema.String,
  tree_path: Schema.String,
  language: Schema.String
})

const SourceGraphEdgeSchema = Schema.Struct({
  source: Schema.String,
  target: Schema.String,
  kind: Schema.Literal("reference")
})

const SourceProjectGraphSchema = Schema.Struct({
  project_slug: Schema.String,
  nodes: Schema.Array(SourceGraphNodeSchema),
  edges: Schema.Array(SourceGraphEdgeSchema)
})

type SourceProjectGraph = Schema.Schema.Type<typeof SourceProjectGraphSchema>

type SourceGraphRenderInput = {
  readonly currentNodeId: string
  readonly nodes: ReadonlyArray<{
    readonly id: string
    readonly label: string
    readonly url: string
  }>
  readonly edges: ReadonlyArray<{
    readonly source: string
    readonly target: string
    readonly direction: "inbound" | "outbound"
  }>
  readonly navigate: (url: string) => void
}

interface SourceGraphRendererService {
  readonly mount: (container: HTMLDivElement, input: SourceGraphRenderInput) => Effect.Effect<Cleanup, never>
}

class SourceGraphRenderer extends Context.Tag("SourceGraphRenderer")<SourceGraphRenderer, SourceGraphRendererService>() {}

const SourceGraphRendererLive = Layer.succeed(SourceGraphRenderer, {
  mount: (container, input) => Effect.sync(() => mountForceGraph(container, input))
})

const decodePayload = (container: HTMLDivElement) =>
  Effect.gen(function* () {
    const payload = container.querySelector<HTMLScriptElement>("script[data-source-graph-payload]")
    if (!payload) {
      return null
    }

    const graph = yield* Effect.sync(() => {
      try {
        return JSON.parse(payload.textContent ?? "") as unknown
      } catch {
        return null
      }
    }).pipe(
      Effect.flatMap((value) =>
        value === null
          ? Effect.succeed(null)
          : Schema.decodeUnknown(SourceProjectGraphSchema)(value).pipe(
              Effect.catchAll(() => Effect.succeed(null))
            )
      )
    )

    payload.remove()
    return graph
  })

const toRenderInput = (
  container: HTMLDivElement,
  graph: SourceProjectGraph,
  navigate: (url: string) => void
): SourceGraphRenderInput | null => {
  const currentNodeId = container.dataset.currentNode ?? ""
  const currentNode = graph.nodes.find((node) => node.id === currentNodeId)
  if (!currentNode) {
    return null
  }

  const collectionPrefix = `${currentNodeId.split(":").slice(0, 2).join(":")}:`
  const relevantEdges = graph.edges.filter((edge) =>
    (edge.source === currentNodeId || edge.target === currentNodeId) &&
    edge.source.startsWith(collectionPrefix) &&
    edge.target.startsWith(collectionPrefix)
  )
  if (relevantEdges.length === 0) {
    return null
  }

  const connectedNodeIds = new Set(
    relevantEdges.map((edge) => edge.source === currentNodeId ? edge.target : edge.source)
  )
  const connectedNodes = graph.nodes
    .filter((node) => connectedNodeIds.has(node.id))
    .sort((left, right) => left.label.localeCompare(right.label))
    .slice(0, 18)

  const scopedNodeIds = new Set([currentNodeId, ...connectedNodes.map((node) => node.id)])
  const scopedEdges = relevantEdges
    .filter((edge) => scopedNodeIds.has(edge.source) && scopedNodeIds.has(edge.target))
    .map((edge) => ({
      source: edge.source,
      target: edge.target,
      direction: edge.source === currentNodeId ? "outbound" as const : "inbound" as const
    }))
  if (scopedEdges.length === 0) {
    return null
  }

  return {
    currentNodeId,
    nodes: [currentNode, ...connectedNodes].map((node) => ({
      id: node.id,
      label: node.label,
      url: node.url
    })),
    edges: scopedEdges,
    navigate
  }
}

const mountContainer = (container: HTMLDivElement) =>
  Effect.gen(function* () {
    const browser = yield* Browser
    if (container.dataset.graphReady === "true") {
      return null
    }

    const graph = yield* decodePayload(container)
    if (!graph || graph.nodes.length === 0) {
      container.remove()
      return null
    }

    const input = toRenderInput(container, graph, (url) => browser.location.assign(url))
    if (!input) {
      container.remove()
      return null
    }

    container.dataset.graphReady = "true"
    container.dataset.graphNodeCount = String(input.nodes.length)
    container.dataset.graphEdgeCount = String(input.edges.length)

    const renderer = yield* SourceGraphRenderer
    return yield* renderer.mount(container, input)
  })

export const initializeSourceGraphs = Effect.gen(function* () {
  const browser = yield* Browser
  const containers = Array.from(browser.document.querySelectorAll<HTMLDivElement>("[data-source-graph]"))
  if (containers.length === 0) {
    return () => {}
  }

  const cleanups = yield* Effect.forEach(containers, (container) => mountContainer(container))
  const activeCleanups = cleanups.filter((cleanup): cleanup is Cleanup => cleanup !== null)
  return combineCleanups(activeCleanups)
}).pipe(
  Effect.provide(SourceGraphRendererLive)
)
