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
  const label = button.querySelector<HTMLElement>("[data-theme-label]")
  const icon = button.querySelector<SVGUseElement>(".theme-toggle__icon use")

  if (label) {
    label.textContent = `${nextTheme === "dark" ? "Dark" : "Light"} mode`
  }

  if (icon) {
    icon.setAttribute("href", `#icon-theme-${nextTheme}`)
  }

  button.setAttribute("aria-label", `Switch to ${nextTheme} mode`)
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
    button.className = "link-button code-copy-button"

    const label = document.createElement("span")
    label.textContent = "Copy"

    button.append(createIcon("copy"), label)
    button.setAttribute("aria-label", "Copy code")
    button.addEventListener("click", () => {
      void navigator.clipboard.writeText(code.innerText)
        .then(() => {
          label.textContent = "Copied"
          window.setTimeout(() => {
            label.textContent = "Copy"
          }, 1200)
        })
        .catch(() => {
          label.textContent = "Failed"
          window.setTimeout(() => {
            label.textContent = "Copy"
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
