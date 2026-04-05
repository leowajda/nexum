import renderMathInElement from "katex/contrib/auto-render"
import { Effect } from "effect"
import { initializeEurekaUi } from "./eureka-controller"

const themeStorageKey = "nexum-theme"

const getStoredTheme = Effect.sync(() => {
  try {
    const stored = window.localStorage.getItem(themeStorageKey)
    return stored === "light" || stored === "dark" ? stored : null
  } catch {
    return null
  }
})

const resolveTheme = Effect.sync(() => {
  const attribute = document.body.getAttribute("a") || "auto"
  if (attribute === "light" || attribute === "dark") {
    return attribute
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  return "light"
})

const applyTheme = (theme: string) => Effect.sync(() => {
  document.body.setAttribute("a", theme)
})

const updateThemeButton = (button: HTMLButtonElement) =>
  Effect.flatMap(resolveTheme, (currentTheme) =>
    Effect.sync(() => {
      const nextTheme = currentTheme === "dark" ? "Light" : "Dark"
      button.textContent = `${nextTheme} mode`
      button.setAttribute("aria-label", `Switch to ${nextTheme.toLowerCase()} mode`)
    })
  )

const initializeThemeToggle = Effect.sync(() => {
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]")
  if (!button) {
    return
  }

  Effect.runSync(updateThemeButton(button))

  button.addEventListener("click", () => {
    Effect.runSync(
      Effect.gen(function* () {
        const currentTheme = yield* resolveTheme
        const nextTheme = currentTheme === "dark" ? "light" : "dark"
        yield* applyTheme(nextTheme)
        yield* Effect.sync(() => {
          try {
            window.localStorage.setItem(themeStorageKey, nextTheme)
          } catch {
            // Ignore localStorage failures.
          }
        })
        yield* updateThemeButton(button)
      })
    )
  })
})

const initializeCopyButtons = Effect.sync(() => {
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
    button.textContent = "Copy"
    button.addEventListener("click", () => {
      void navigator.clipboard.writeText(code.innerText)
        .then(() => {
          button.textContent = "Copied"
          window.setTimeout(() => {
            button.textContent = "Copy"
          }, 1200)
        })
        .catch(() => {
          button.textContent = "Failed"
          window.setTimeout(() => {
            button.textContent = "Copy"
          }, 1200)
        })
    })

    highlight.prepend(button)
  })
})

const initializeMath = Effect.sync(() => {
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
})

const applyStoredTheme = Effect.gen(function* () {
  const storedTheme = yield* getStoredTheme
  if (storedTheme) {
    yield* applyTheme(storedTheme)
  }
})

const runSafely = (label: string, effect: Effect.Effect<void, unknown>) => {
  try {
    Effect.runSync(effect)
  } catch (error) {
    console.error(`Failed to initialize ${label}`, error)
  }
}

const start = () => {
  runSafely("stored theme", applyStoredTheme)
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
