import { Effect } from "effect"
import { Browser, BrowserLive, addEventListener, type BrowserService, type Cleanup, combineCleanups } from "./browser"
import { initializeCodeReferences } from "./code-references"
import { initializeEurekaUi } from "./eureka-controller"
import {
  initializeBackButton,
  initializeCopyButtons,
  initializeMath,
  initializeSourceSidebar
} from "./site-features"
import { initializeThemeToggle, restoreStoredTheme } from "./site-theme"
const noopCleanup: Cleanup = () => {}

const runBrowserAction = (
  browser: BrowserService,
  label: string,
  effect: Effect.Effect<void, unknown, Browser>
) => {
  Effect.runSync(
    effect.pipe(
      Effect.provideService(Browser, browser),
      Effect.catchAllCause((cause) =>
        Effect.sync(() => {
          browser.console.error(`Failed to ${label}`, cause)
        })
      )
    )
  )
}

const initializeSafely = (label: string, effect: Effect.Effect<Cleanup, unknown, Browser>) =>
  Effect.gen(function* () {
    const browser = yield* Browser
    return yield* effect.pipe(
      Effect.catchAllCause((cause) =>
        Effect.sync(() => {
          browser.console.error(`Failed to initialize ${label}`, cause)
          return noopCleanup
        })
      )
    )
  })

const start = Effect.gen(function* () {
  const browser = yield* Browser
  yield* restoreStoredTheme

  const cleanups = yield* Effect.all([
    initializeSafely(
      "theme toggle",
      initializeThemeToggle(runBrowserAction, noopCleanup)
    ),
    initializeSafely("back button", initializeBackButton(noopCleanup)),
    initializeSafely("copy buttons", initializeCopyButtons()),
    initializeSafely("code references", initializeCodeReferences),
    initializeSafely("source sidebar", initializeSourceSidebar(noopCleanup)),
    initializeSafely("math rendering", initializeMath(noopCleanup)),
    initializeSafely("Eureka UI", initializeEurekaUi)
  ])

  const cleanup = combineCleanups(cleanups)
  yield* addEventListener(browser.window, "pagehide", cleanup, { once: true })
})

const program = start.pipe(Effect.provide(BrowserLive))

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    Effect.runSync(program)
  }, { once: true })
} else {
  Effect.runSync(program)
}
