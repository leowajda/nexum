import { Effect } from "effect"
import { Browser, addEventListener, type Cleanup, combineCleanups } from "./browser"
import {
  decodeFilterButton,
  decodeLanguagePanel,
  decodeProblemRow,
  type FilterKind,
  type FilterButtonModel,
  type LanguagePanelModel,
  type ProblemRowModel
} from "./eureka-model"

type ProblemTableState = {
  readonly search: string
  readonly difficulty: string
  readonly categories: ReadonlySet<string>
  readonly language: string
}

const createProblemTableState = (language: string): ProblemTableState => ({
  search: "",
  difficulty: "",
  categories: new Set<string>(),
  language
})

const toggleSingleSelect = (currentValue: string, nextValue: string) =>
  currentValue === nextValue ? "" : nextValue

const toggleCategory = (categories: ReadonlySet<string>, value: string): ReadonlySet<string> => {
  if (value === "") {
    return new Set<string>()
  }

  const nextCategories = new Set(categories)
  if (nextCategories.has(value)) {
    nextCategories.delete(value)
    return nextCategories
  }

  nextCategories.add(value)
  return nextCategories
}

const matchesProblemRow = (state: ProblemTableState, row: ProblemRowModel) =>
  (!state.search || row.searchTitle.includes(state.search))
  && (!state.difficulty || row.difficulty === state.difficulty)
  && (!state.language || row.languages.includes(state.language))
  && (state.categories.size === 0 || row.categories.some((category) => state.categories.has(category)))

const initializeProblemTable = Effect.gen(function* () {
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

  const syncSingleSelectButtons = (kind: Exclude<FilterKind, "clear" | "category">, activeValue: string) => {
    filterButtons.forEach((button) => {
      if (button.kind !== kind) {
        return
      }

      button.element.classList.toggle("is-active", button.value === activeValue || (!activeValue && button.value === ""))
    })
  }

  const syncCategoryButtons = () => {
    filterButtons.forEach((button) => {
      if (button.kind !== "category") {
        return
      }

      const isActive = button.value === "" ? state.categories.size === 0 : state.categories.has(button.value)
      button.element.classList.toggle("is-active", isActive)
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
      state = {
        ...state,
        search: searchInput.value.trim().toLowerCase()
      }
      render()
    }))
  }

  for (const button of filterButtons) {
    cleanups.push(yield* addEventListener(button.element, "click", () => {
      const { kind, value } = button

      if (kind === "clear") {
        state = createProblemTableState(defaultLanguage)

        if (searchInput) {
          searchInput.value = ""
        }

        filterButtons.forEach((item) => item.element.classList.remove("is-active"))
        activateDefaults()
        render()
        return
      }

      if (kind === "category") {
        state = {
          ...state,
          categories: toggleCategory(state.categories, value)
        }
        syncCategoryButtons()
      } else if (kind === "difficulty" || kind === "language") {
        state = {
          ...state,
          [kind]: toggleSingleSelect(state[kind], value)
        }
        syncSingleSelectButtons(kind, state[kind])
      }

      render()
    }))
  }

  activateDefaults()
  render()
  return combineCleanups(cleanups)
})

const getDefaultImplementation = (languagePanels: Array<HTMLElement>, language: string) => {
  const panel = languagePanels.find((item) => item.dataset.language === language)
  if (!panel) {
    return ""
  }

  const firstImplementation = panel.querySelector<HTMLElement>("[data-implementation-panel]")
  return firstImplementation ? firstImplementation.id : ""
}

const initializeProblemShells = Effect.gen(function* () {
  const browser = yield* Browser
  const cleanups: Array<Cleanup> = []

  for (const shell of browser.document.querySelectorAll<HTMLElement>("[data-problem-shell]")) {
    const languageButtons = Array.from(shell.querySelectorAll<HTMLButtonElement>("[data-language-target]"))
    const languagePanels = yield* Effect.forEach(
      Array.from(shell.querySelectorAll<HTMLElement>("[data-language-panel]")),
      decodeLanguagePanel
    )

    if (!languageButtons.length || !languagePanels.length) {
      continue
    }

    const implementationMap = new Map<string, { language: string; implementationId: string }>()
    languagePanels.forEach((panel) => {
      panel.element.querySelectorAll<HTMLElement>("[data-implementation-panel]").forEach((implementationPanel) => {
        implementationMap.set(implementationPanel.id, {
          language: panel.language,
          implementationId: implementationPanel.id
        })
      })
    })

    const params = new URLSearchParams(browser.location.search)
    const requestedImplementation = params.get("implementation") || ""
    const requestedLanguage = params.get("language") || ""
    const initial = implementationMap.get(requestedImplementation)
    const initialLanguage = initial?.language
      || (requestedLanguage && languagePanels.some((panel) => panel.language === requestedLanguage)
        ? requestedLanguage
        : (languagePanels[0]?.language || ""))
    const initialImplementation = initial?.implementationId || getDefaultImplementation(languagePanels.map((panel) => panel.element), initialLanguage)

    const activateImplementation = (panel: HTMLElement, implementationId: string) => {
      const implementationButtons = Array.from(panel.querySelectorAll<HTMLButtonElement>("[data-implementation-target]"))
      const implementationPanels = Array.from(panel.querySelectorAll<HTMLElement>("[data-implementation-panel]"))
      const implementationActions = Array.from(panel.querySelectorAll<HTMLElement>("[data-implementation-actions]"))
      const nextImplementationId = implementationButtons.some((button) => button.dataset.implementationTarget === implementationId)
        ? implementationId
        : getDefaultImplementation(languagePanels.map((item) => item.element), panel.dataset.language || "")

      implementationButtons.forEach((button) => {
        const isActive = button.dataset.implementationTarget === nextImplementationId
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      implementationPanels.forEach((implementationPanel) => {
        implementationPanel.hidden = implementationPanel.id !== nextImplementationId
      })

      implementationActions.forEach((actions) => {
        actions.hidden = actions.dataset.implementationActions !== nextImplementationId
      })
    }

    const activateLanguage = (language: string, implementationId: string, updateUrl: boolean) => {
      languageButtons.forEach((button) => {
        const isActive = button.dataset.languageTarget === language
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      languagePanels.forEach((panel) => {
        panel.element.hidden = panel.language !== language
      })

      const activePanel = languagePanels.find((panel) => panel.language === language)
      if (!activePanel) {
        return
      }

      const nextImplementationId = implementationId || getDefaultImplementation(languagePanels.map((item) => item.element), language)
      activateImplementation(activePanel.element, nextImplementationId)

      if (updateUrl && nextImplementationId) {
        const url = new URL(browser.location.href)
        url.searchParams.set("language", language)
        url.searchParams.set("implementation", nextImplementationId)
        browser.history.replaceState(null, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`)
      }
    }

    activateLanguage(initialLanguage, initialImplementation, false)

    for (const button of languageButtons) {
      cleanups.push(yield* addEventListener(button, "click", () => {
        const targetLanguage = button.dataset.languageTarget || ""
        activateLanguage(targetLanguage, getDefaultImplementation(languagePanels.map((item) => item.element), targetLanguage), true)
      }))
    }

    for (const panel of languagePanels) {
      for (const button of panel.element.querySelectorAll<HTMLButtonElement>("[data-implementation-target]")) {
        cleanups.push(yield* addEventListener(button, "click", () => {
          activateLanguage(panel.language, button.dataset.implementationTarget || "", true)
        }))
      }
    }
  }

  return combineCleanups(cleanups)
})

export const initializeEurekaUi = Effect.gen(function* () {
  const cleanups = yield* Effect.all([
    initializeProblemTable,
    initializeProblemShells
  ])

  return combineCleanups(cleanups)
})
