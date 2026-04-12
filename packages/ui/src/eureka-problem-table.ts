import { Effect } from "effect"
import { Browser, addEventListener, type Cleanup, combineCleanups } from "./browser"
import {
  decodeFilterButton,
  decodeProblemRow,
  type FilterKind
} from "./eureka-model"
import {
  createProblemTableState,
  isCategoryButtonActive,
  isSingleSelectButtonActive,
  matchesProblemRow,
  reduceProblemTableState
} from "./eureka-problem-table-state"

export const initializeProblemTable = Effect.gen(function* () {
  const browser = yield* Browser
  const table = browser.document.getElementById("problem-table")
  if (!table) {
    return () => {}
  }

  const searchInput = browser.document.querySelector<HTMLInputElement>("[data-search-input]")
  const filterButtons = yield* Effect.forEach(
    Array.from(browser.document.querySelectorAll<HTMLButtonElement>("[data-filter-kind]")),
    decodeFilterButton
  )
  const summary = {
    visible: browser.document.querySelector<HTMLElement>("[data-visible-count]"),
    total: browser.document.querySelector<HTMLElement>("[data-total-count]")
  }

  const rows = yield* Effect.forEach(
    Array.from(table.querySelectorAll<HTMLElement>("[data-problem-row]")),
    decodeProblemRow
  )
  const defaultLanguage = table.dataset.languageFilter || ""
  let state = createProblemTableState(defaultLanguage)

  const syncSingleSelectButtons = (kind: Exclude<FilterKind, "clear" | "category">) => {
    filterButtons.forEach((button) => {
      if (button.kind !== kind) {
        return
      }

      button.element.classList.toggle("is-active", isSingleSelectButtonActive(state, kind, button.value))
    })
  }

  const syncCategoryButtons = () => {
    filterButtons.forEach((button) => {
      if (button.kind !== "category") {
        return
      }

      button.element.classList.toggle("is-active", isCategoryButtonActive(state, button.value))
    })
  }

  const activateDefaults = () => {
    filterButtons.forEach((button) => {
      if (button.kind === "difficulty" && button.value === "") {
        button.element.classList.add("is-active")
      }

      if (button.kind === "language" && button.value === state.language) {
        button.element.classList.add("is-active")
      }

      if (button.kind === "category" && button.value === "") {
        button.element.classList.add("is-active")
      }
    })
  }

  const render = () => {
    let visibleCount = 0

    rows.forEach((row) => {
      const matches = matchesProblemRow(state, row)
      row.element.hidden = !matches
      if (matches) {
        visibleCount += 1
      }
    })

    if (summary.visible) {
      summary.visible.textContent = String(visibleCount)
    }

    if (summary.total) {
      summary.total.textContent = String(rows.length)
    }
  }

  const cleanups: Array<Cleanup> = []

  if (searchInput) {
    cleanups.push(yield* addEventListener(searchInput, "input", () => {
      state = reduceProblemTableState(state, { type: "search", value: searchInput.value })
      render()
    }))
  }

  for (const button of filterButtons) {
    cleanups.push(yield* addEventListener(button.element, "click", () => {
      const { kind, value } = button

      if (kind === "clear") {
        state = reduceProblemTableState(state, { type: "clear", defaultLanguage })

        if (searchInput) {
          searchInput.value = ""
        }

        filterButtons.forEach((item) => item.element.classList.remove("is-active"))
        activateDefaults()
        render()
        return
      }

      if (kind === "category") {
        state = reduceProblemTableState(state, { type: "category", value })
        syncCategoryButtons()
      } else if (kind === "difficulty" || kind === "language") {
        state = reduceProblemTableState(state, { type: kind, value })
        syncSingleSelectButtons(kind)
      }

      render()
    }))
  }

  activateDefaults()
  render()
  return combineCleanups(cleanups)
})
