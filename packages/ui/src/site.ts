import renderMathInElement from "katex/contrib/auto-render"
import { Effect } from "effect"

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

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
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

const waitForDomReady = Effect.async<void, never>((resume) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => resume(Effect.void), { once: true })
    return
  }

  resume(Effect.void)
})

const initializeThemeToggle = Effect.sync(() => {
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]")
  if (!button) {
    return
  }

  void Effect.runPromise(updateThemeButton(button))

  button.addEventListener("click", () => {
    void Effect.runPromise(
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

const program = Effect.gen(function* () {
  const storedTheme = yield* getStoredTheme
  if (storedTheme) {
    yield* applyTheme(storedTheme)
  }

  yield* waitForDomReady
  yield* initializeThemeToggle
  yield* initializeCopyButtons
  yield* initializeMath
})

void Effect.runPromise(program)
