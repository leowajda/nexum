import renderMathInElement from "katex/contrib/auto-render"
import { initializeEurekaUi } from "./eureka-controller"
import { createIcon } from "./icons"

const themeStorageKey = "leowajda.github.io-theme"

type Theme = "light" | "dark"

const getStoredTheme = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(themeStorageKey)
    return stored === "light" || stored === "dark" ? stored : null
  } catch {
    return null
  }
}

const resolveTheme = (): Theme => {
  const attribute = document.body.getAttribute("a") || "auto"
  if (attribute === "light" || attribute === "dark") {
    return attribute
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  return "light"
}

const applyTheme = (theme: Theme) => {
  document.body.setAttribute("a", theme)
}

const updateThemeButton = (button: HTMLButtonElement) => {
  const currentTheme = resolveTheme()
  const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark"
  const icon = button.querySelector<SVGUseElement>(".theme-toggle__icon use")

  if (icon) {
    icon.setAttribute("href", `#icon-theme-${nextTheme}`)
  }

  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`)
  button.setAttribute("title", `Switch to ${nextTheme} mode`)
}

const initializeThemeToggle = () => {
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]")
  if (!button) {
    return
  }

  updateThemeButton(button)

  button.addEventListener("click", () => {
    const nextTheme = resolveTheme() === "dark" ? "light" : "dark"
    applyTheme(nextTheme)

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme)
    } catch {
      // Ignore localStorage failures.
    }

    updateThemeButton(button)
  })
}

const initializeCopyButtons = () => {
  const highlights = document.querySelectorAll<HTMLElement>(".highlight")
  highlights.forEach((highlight) => {
    if (highlight.dataset.codeEnhanced === "true") {
      return
    }

    const pre = highlight.querySelector<HTMLElement>("pre")
    const code = highlight.querySelector<HTMLElement>("code")
    if (!pre || !code) {
      return
    }

    highlight.dataset.codeEnhanced = "true"
    highlight.classList.add("code-enhanced")

    const button = document.createElement("button")
    button.type = "button"
    button.className = "link-button icon-button code-copy-button"
    button.append(createIcon("copy"))
    button.setAttribute("aria-label", "Copy code")
    button.setAttribute("title", "Copy code")
    button.addEventListener("click", () => {
      void navigator.clipboard.writeText(code.innerText)
        .then(() => {
          button.setAttribute("title", "Copied")
          button.setAttribute("aria-label", "Copied")
          window.setTimeout(() => {
            button.setAttribute("title", "Copy code")
            button.setAttribute("aria-label", "Copy code")
          }, 1200)
        })
        .catch(() => {
          button.setAttribute("title", "Copy failed")
          button.setAttribute("aria-label", "Copy failed")
          window.setTimeout(() => {
            button.setAttribute("title", "Copy code")
            button.setAttribute("aria-label", "Copy code")
          }, 1200)
        })
    })

    highlight.prepend(button)
  })
}

const initializeMath = () => {
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false }
    ],
    throwOnError: false,
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
  })
}

const runSafely = (label: string, effect: () => void) => {
  try {
    effect()
  } catch (error) {
    console.error(`Failed to initialize ${label}`, error)
  }
}

const start = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    applyTheme(storedTheme)
  }

  runSafely("theme toggle", initializeThemeToggle)
  runSafely("copy buttons", initializeCopyButtons)
  runSafely("math rendering", initializeMath)

  try {
    initializeEurekaUi()
  } catch (error) {
    console.error("Failed to initialize Eureka UI", error)
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true })
} else {
  start()
}
