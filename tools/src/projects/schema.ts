import { Schema } from "effect"

export const ProjectManifestSchema = Schema.Struct({
  kind: Schema.String,
  slug: Schema.String,
  title: Schema.String,
  description: Schema.String,
  route_base: Schema.String,
  source_repo_path: Schema.String,
  source_optional: Schema.optional(Schema.Boolean)
})

export type ProjectManifest = Schema.Schema.Type<typeof ProjectManifestSchema>
