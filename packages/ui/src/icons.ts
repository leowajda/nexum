const iconNamespace = "http://www.w3.org/2000/svg"

export type IconName =
  | "back"
  | "code"
  | "copy"
  | "iterative"
  | "leetcode"
  | "open-page"
  | "recursive"
  | "theme-dark"
  | "theme-light"

export const createIcon = (name: IconName) => {
  const svg = document.createElementNS(iconNamespace, "svg")
  svg.classList.add("icon")
  svg.setAttribute("aria-hidden", "true")
  svg.setAttribute("focusable", "false")

  const use = document.createElementNS(iconNamespace, "use")
  use.setAttribute("href", `#icon-${name}`)
  svg.append(use)

  return svg
}
