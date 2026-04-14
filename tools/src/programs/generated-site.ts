import { Effect } from "effect"
import path from "node:path"
import { jekyllSourceDirectory } from "../core/paths.js"
import { FileStore } from "../core/workspace.js"

const generatedManifestPath = path.join(jekyllSourceDirectory, ".generated-files.json")

type GeneratedFilesManifest = {
  readonly version: 1
  readonly files: ReadonlyArray<string>
}

const emptyManifest: GeneratedFilesManifest = {
  version: 1,
  files: []
}

const decodeGeneratedFilesManifest = (content: string): GeneratedFilesManifest => {
  try {
    const parsed = JSON.parse(content) as { version?: unknown; files?: unknown }
    return parsed.version === 1 && Array.isArray(parsed.files) && parsed.files.every((file) => typeof file === "string")
      ? { version: 1, files: parsed.files }
      : emptyManifest
  } catch {
    return emptyManifest
  }
}

const normalizeGeneratedPath = (filePath: string) => {
  const relativePath = path.relative(jekyllSourceDirectory, filePath)
  if (relativePath === "" || relativePath.startsWith("..")) {
    return null
  }

  return relativePath.split(path.sep).join("/")
}

export const clearGeneratedOutputs = Effect.gen(function* () {
  const fileStore = yield* FileStore
  const manifest = yield* fileStore.readText(generatedManifestPath).pipe(
    Effect.map(decodeGeneratedFilesManifest),
    Effect.catchAll(() => Effect.succeed(emptyManifest))
  )

  yield* Effect.forEach(manifest.files, (relativePath) =>
    fileStore.removePath(path.join(jekyllSourceDirectory, relativePath)).pipe(
      Effect.catchAll(() => Effect.void)
    )
  , { concurrency: 8 })

  yield* fileStore.removePath(generatedManifestPath).pipe(
    Effect.catchAll(() => Effect.void)
  )
})

export const writeGeneratedOutputsManifest = (filePaths: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const files = Array.from(new Set(
      filePaths
        .map(normalizeGeneratedPath)
        .filter((filePath): filePath is string => filePath !== null)
    )).sort((left, right) => left.localeCompare(right))

    const manifest: GeneratedFilesManifest = {
      version: 1,
      files
    }

    yield* fileStore.writeText(generatedManifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  })
