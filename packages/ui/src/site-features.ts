import renderMathInElement from "katex/contrib/auto-render"
import { Effect } from "effect"
import { Browser, addEventListener, type Cleanup, combineCleanups } from "./browser"

const resetCopyButtonLabel = (button: HTMLButtonElement, label: string) => {
  button.setAttribute("title", label)
  button.setAttribute("aria-label", label)
}

export const initializeBackButton = (noopCleanup: Cleanup) =>
  Effect.gen(function* () {
    const browser = yield* Browser
    const button = browser.document.querySelector<HTMLButtonElement>("[data-back-button]")
    if (!button) {
      return noopCleanup
    }

    let referrerUrl: URL | null = null

    try {
      const referrer = browser.document.referrer
      if (referrer) {
        const parsed = new URL(referrer)
        if (parsed.origin === browser.location.origin) {
          referrerUrl = parsed
        }
      }
    } catch {
      referrerUrl = null
    }

    if (!referrerUrl) {
      button.hidden = true
      return noopCleanup
    }

    button.hidden = false
    button.setAttribute("aria-label", "Back to previous page")
    button.setAttribute("title", "Back to previous page")
    return yield* addEventListener(button, "click", () => {
      browser.history.back()
    })
  })

export const initializeCopyButtons = () =>
  Effect.gen(function* () {
    const browser = yield* Browser
    const cleanups: Array<Cleanup> = []

    for (const button of browser.document.querySelectorAll<HTMLButtonElement>("[data-code-copy-button]")) {
      if (button.dataset.copyReady === "true") {
        continue
      }
      button.dataset.copyReady = "true"

      const findCodeText = () => {
        const shell = button.closest<HTMLElement>(".code-shell")
        if (!shell) {
          return ""
        }

        const visiblePanelCode = shell.querySelector<HTMLElement>(
          ".code-shell__panel:not([hidden]) .code-markdown .highlight code"
        )
        if (visiblePanelCode) {
          return visiblePanelCode.innerText
        }

        const fallback = shell.querySelector<HTMLElement>(".code-markdown .highlight code")
        return fallback ? fallback.innerText : ""
      }

      cleanups.push(yield* addEventListener(button, "click", () => {
        const codeText = findCodeText()
        if (!codeText || !browser.navigator.clipboard) {
          resetCopyButtonLabel(button, "Copy failed")
          browser.window.setTimeout(() => resetCopyButtonLabel(button, "Copy code"), 1200)
          return
        }

        void browser.navigator.clipboard.writeText(codeText)
          .then(() => {
            resetCopyButtonLabel(button, "Copied")
            browser.window.setTimeout(() => resetCopyButtonLabel(button, "Copy code"), 1200)
          })
          .catch(() => {
            resetCopyButtonLabel(button, "Copy failed")
            browser.window.setTimeout(() => resetCopyButtonLabel(button, "Copy code"), 1200)
          })
      }))
    }

    return combineCleanups(cleanups)
  })

export const initializeSourceSidebar = (noopCleanup: Cleanup) =>
  Effect.gen(function* () {
    const browser = yield* Browser
    const sidebar = browser.document.querySelector<HTMLElement>(".source-sidebar")
    if (!sidebar) {
      return noopCleanup
    }

    const activeLink = sidebar.querySelector<HTMLElement>(".source-tree__link.is-active")
    if (!activeLink) {
      return noopCleanup
    }

    const groups = Array.from(sidebar.querySelectorAll<HTMLDetailsElement>(".source-tree__group"))
    groups.forEach((group) => {
      group.open = false
    })

    let cursor: HTMLElement | null = activeLink
    while (cursor) {
      if (cursor instanceof HTMLDetailsElement && cursor.classList.contains("source-tree__group")) {
        cursor.open = true
      }
      cursor = cursor.parentElement
    }

    activeLink.scrollIntoView({
      block: "center",
      inline: "nearest"
    })

    return noopCleanup
  })

export const initializeMath = (noopCleanup: Cleanup) =>
  Effect.gen(function* () {
    const browser = yield* Browser
    renderMathInElement(browser.document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    })

    return noopCleanup
  })
