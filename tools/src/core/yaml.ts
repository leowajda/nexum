import { Effect, ParseResult, Schema } from "effect"
import yaml from "yaml"
import { SchemaValidationError, YamlParseError } from "./errors.js"

const formatSchemaError = (error: ParseResult.ParseError) =>
  ParseResult.TreeFormatter.formatErrorSync(error)

export const parseYaml = (context: string, raw: string) =>
  Effect.try({
    try: () => yaml.parse(raw),
    catch: (error) => new YamlParseError({ context, reason: String(error) })
  })

export const decodeYaml = <A>(context: string, raw: string, schema: Schema.Schema<A, any, never>) =>
  parseYaml(context, raw).pipe(
    Effect.flatMap((value) =>
      Schema.decodeUnknown(schema)(value).pipe(
        Effect.mapError((error) => new SchemaValidationError({ context, reason: formatSchemaError(error) }))
      )
    )
  )

export const encodeYaml = <A>(context: string, schema: Schema.Schema<A, any, never>, value: A) =>
  Schema.encode(schema)(value).pipe(
    Effect.map((encoded) => yaml.stringify(encoded)),
    Effect.mapError((error) => new SchemaValidationError({ context, reason: formatSchemaError(error) }))
  )
