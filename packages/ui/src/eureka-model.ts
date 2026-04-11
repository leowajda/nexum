import { Effect, Schema } from "effect"

const FilterKindSchema = Schema.Literal("clear", "difficulty", "language", "category")

const FilterButtonModelSchema = Schema.Struct({
  kind: FilterKindSchema,
  value: Schema.String
})

const ProblemRowModelSchema = Schema.Struct({
  searchTitle: Schema.String,
  difficulty: Schema.String,
  languages: Schema.Array(Schema.String),
  categories: Schema.Array(Schema.String)
})

const LanguagePanelModelSchema = Schema.Struct({
  language: Schema.String
})

const decodeDataset = <A>(schema: Schema.Schema<A, any, never>, raw: unknown) =>
  Schema.decodeUnknown(schema)(raw)

export type FilterKind = Schema.Schema.Type<typeof FilterKindSchema>

export type FilterButtonModel = Schema.Schema.Type<typeof FilterButtonModelSchema> & {
  readonly element: HTMLButtonElement
}

export type ProblemRowModel = Schema.Schema.Type<typeof ProblemRowModelSchema> & {
  readonly element: HTMLElement
}

export type LanguagePanelModel = Schema.Schema.Type<typeof LanguagePanelModelSchema> & {
  readonly element: HTMLElement
}

export const decodeFilterButton = (element: HTMLButtonElement) =>
  decodeDataset(FilterButtonModelSchema, {
    kind: element.dataset.filterKind,
    value: element.dataset.filterValue || ""
  }).pipe(
    Effect.map((model) => ({ ...model, element }))
  )

export const decodeProblemRow = (element: HTMLElement) =>
  decodeDataset(ProblemRowModelSchema, {
    searchTitle: element.dataset.searchTitle || "",
    difficulty: element.dataset.difficulty || "",
    languages: element.dataset.languages ? element.dataset.languages.split("|").filter(Boolean) : [],
    categories: element.dataset.categories ? element.dataset.categories.split("|").filter(Boolean) : []
  }).pipe(
    Effect.map((model) => ({ ...model, element }))
  )

export const decodeLanguagePanel = (element: HTMLElement) =>
  decodeDataset(LanguagePanelModelSchema, {
    language: element.dataset.language || ""
  }).pipe(
    Effect.map((model) => ({ ...model, element }))
  )
