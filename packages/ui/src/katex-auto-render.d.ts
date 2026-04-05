declare module "katex/contrib/auto-render" {
  export interface Delimiter {
    left: string
    right: string
    display: boolean
  }

  export interface RenderMathOptions {
    delimiters?: ReadonlyArray<Delimiter>
    throwOnError?: boolean
    ignoredTags?: ReadonlyArray<string>
  }

  const renderMathInElement: (element: Element, options?: RenderMathOptions) => void
  export default renderMathInElement
}
