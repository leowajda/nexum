import {
  convertToExcalidrawElements,
  exportToSvg,
  serializeAsJSON
} from "@excalidraw/excalidraw"
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw"
import { architectureGroupPalette, architectureGroupTitles } from "./catalog.js"
import { diagramElementId } from "./mermaid.js"
import type { ArchitectureDiagram, ArchitectureGroup, ArchitectureNode, DiagramPlacement } from "./schema.js"

type BinaryFiles = Record<string, unknown>

type SceneElement = {
  readonly id: string
  readonly type: string
  readonly x: number
  readonly y: number
  readonly width?: number
  readonly height?: number
  readonly strokeColor?: string
  readonly backgroundColor?: string
  readonly fillStyle?: string
  readonly strokeWidth?: number
  readonly roundness?: unknown
  readonly text?: string
  readonly containerId?: string | null
  readonly startBinding?: { readonly elementId: string } | null
  readonly endBinding?: { readonly elementId: string } | null
}

type RenderPayload = {
  readonly mermaid: string
  readonly diagram: ArchitectureDiagram
  readonly nodes: ReadonlyArray<ArchitectureNode>
}

declare global {
  interface Window {
    __renderArchitectureDiagram?: (payload: RenderPayload) => Promise<{
      readonly svg: string
      readonly scene: string
    }>
  }
}

const noteOffsetByPlacement: Readonly<Record<DiagramPlacement, { readonly x: number; readonly y: number }>> = {
  top: { x: 0, y: -150 },
  right: { x: 180, y: 0 },
  bottom: { x: 0, y: 150 },
  left: { x: -180, y: 0 }
}

const isRenderableShape = (element: SceneElement) =>
  element.type === "rectangle" || element.type === "ellipse" || element.type === "diamond"

const minBy = (values: ReadonlyArray<number>) => Math.min(...values)

const resolveNodeShape = (elements: ReadonlyArray<SceneElement>, node: ArchitectureNode): SceneElement | undefined => {
  const targetId = diagramElementId(node.id)
  const directMatch = elements.find((element) => element.id === targetId && isRenderableShape(element))
  if (directMatch) {
    return directMatch
  }

  const boundText = elements.find((element) => element.type === "text" && element.text === node.label && element.containerId)
  return boundText?.containerId
    ? elements.find((element) => element.id === boundText.containerId && isRenderableShape(element))
    : undefined
}

const buildLegendSkeletons = (originX: number, originY: number) => {
  const groups = Object.entries(architectureGroupTitles) as ReadonlyArray<readonly [ArchitectureGroup, string]>

  return groups.flatMap(([group, title], index) => {
    const x = originX + index * 200
    const palette = architectureGroupPalette[group]
    const id = `legend-${group}`
    return [
      {
        id,
        type: "rectangle",
        x,
        y: originY,
        width: 180,
        height: 52,
        strokeColor: palette.stroke,
        backgroundColor: palette.fill,
        fillStyle: "solid",
        roundness: { type: 3 },
        strokeWidth: 2,
        label: {
          text: title,
          fontSize: 18,
          strokeColor: palette.text
        }
      }
    ]
  })
}

const buildAnnotationSkeletons = (
  diagram: ArchitectureDiagram,
  nodes: ReadonlyArray<ArchitectureNode>,
  elements: ReadonlyArray<SceneElement>
) =>
  diagram.annotations.flatMap((annotation) => {
    const node = nodes.find((entry) => entry.id === annotation.target)
    const target = node ? resolveNodeShape(elements, node) : undefined
    if (!target || target.width === undefined || target.height === undefined) {
      return []
    }

    const palette = architectureGroupPalette[annotation.tone]
    const offset = noteOffsetByPlacement[annotation.placement]
    const targetCenterX = target.x + target.width / 2
    const targetCenterY = target.y + target.height / 2
    const noteWidth = 220
    const noteHeight = 96
    const noteX = targetCenterX - noteWidth / 2 + offset.x
    const noteY = targetCenterY - noteHeight / 2 + offset.y
    const noteId = annotation.id

    return [
      {
        id: noteId,
        type: "rectangle",
        x: noteX,
        y: noteY,
        width: noteWidth,
        height: noteHeight,
        strokeColor: palette.stroke,
        backgroundColor: palette.fill,
        fillStyle: "solid",
        roundness: { type: 3 },
        strokeWidth: 2,
        label: {
          text: annotation.text,
          fontSize: 18,
          strokeColor: palette.text,
          textAlign: "left",
          verticalAlign: "middle"
        }
      },
      {
        id: `${noteId}-arrow`,
        type: "arrow",
        x: noteX + noteWidth / 2,
        y: noteY + noteHeight / 2,
        strokeColor: palette.stroke,
        backgroundColor: "transparent",
        strokeWidth: 2,
        start: { id: noteId },
        end: { id: target.id },
        endArrowhead: "triangle"
      }
    ]
  })

const decorateElements = (
  elements: ReadonlyArray<SceneElement>,
  nodes: ReadonlyArray<ArchitectureNode>
): ReadonlyArray<SceneElement> => {
  const nodeById = new Map(nodes.map((node) => [diagramElementId(node.id), node]))
  const paletteByNodeId = new Map(nodes.map((node) => [diagramElementId(node.id), architectureGroupPalette[node.group]]))

  return elements.map((element) => {
    const nodePalette = paletteByNodeId.get(element.id)
    if (nodePalette && isRenderableShape(element)) {
      return {
        ...element,
        strokeColor: nodePalette.stroke,
        backgroundColor: nodePalette.fill,
        fillStyle: "solid",
        strokeWidth: 2.5,
        roundness: element.type === "rectangle" ? { type: 3 } : element.roundness
      }
    }

    if (element.type === "text" && element.containerId) {
      const containerNode = nodeById.get(element.containerId)
      if (containerNode) {
        const palette = architectureGroupPalette[containerNode.group]
        return {
          ...element,
          strokeColor: palette.text
        }
      }
    }

    if (element.type === "arrow") {
      const sourceNode = element.startBinding?.elementId ? nodeById.get(element.startBinding.elementId) : undefined
      if (sourceNode) {
        const palette = architectureGroupPalette[sourceNode.group]
        return {
          ...element,
          strokeColor: palette.stroke,
          backgroundColor: palette.stroke,
          strokeWidth: 2.2
        }
      }
    }

    return element
  })
}

window.__renderArchitectureDiagram = async ({ mermaid, diagram, nodes }) => {
  const { elements, files } = await parseMermaidToExcalidraw(mermaid)
  const phaseOneElements = convertToExcalidrawElements(elements, { regenerateIds: false }) as ReadonlyArray<SceneElement>
  const minX = minBy(phaseOneElements.map((element) => element.x))
  const minY = minBy(phaseOneElements.map((element) => element.y))

  const decorations = [
    {
      id: `${diagram.id}-title`,
      type: "text",
      x: minX,
      y: minY - 140,
      text: diagram.title,
      fontSize: 34,
      strokeColor: "#111827"
    },
    ...buildLegendSkeletons(minX, minY - 80),
    ...buildAnnotationSkeletons(diagram, nodes, phaseOneElements)
  ]

  const finalElements = decorateElements(
    convertToExcalidrawElements([...elements, ...decorations], { regenerateIds: false }) as ReadonlyArray<SceneElement>,
    nodes
  )
  const binaryFiles = (files ?? {}) as BinaryFiles
  const appState = {
    exportBackground: true,
    exportEmbedScene: false,
    exportWithDarkMode: false,
    viewBackgroundColor: "#ffffff"
  } as const
  const svg = await exportToSvg({
    elements: finalElements as any,
    files: binaryFiles as any,
    appState: appState as any,
    exportPadding: 32
  } as any)

  return {
    svg: new XMLSerializer().serializeToString(svg),
    scene: serializeAsJSON(finalElements as any, appState as any, binaryFiles as any, "local")
  }
}
