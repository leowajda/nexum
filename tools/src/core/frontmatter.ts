import { Effect, Schema } from "effect"
import { encodeYaml } from "./yaml.js"

const FrontMatterSchema = Schema.Record({ key: Schema.String, value: Schema.Unknown })

export const encodeFrontMatter = (context: string, payload: Record<string, unknown>) =>
  encodeYaml(context, FrontMatterSchema, payload).pipe(
    Effect.map((content) => `---\n${content}---\n`)
  )
