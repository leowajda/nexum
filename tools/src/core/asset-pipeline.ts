import { Effect } from "effect"
import { build } from "esbuild"
import path from "node:path"
import { AssetBuildError } from "./errors.js"
import { FileStore } from "./workspace.js"
import { jekyllSourceDirectory, nodeModulesDirectory, rootDirectory } from "./paths.js"

const assetBuildFailure = (error: unknown) =>
  new AssetBuildError({ reason: String(error) })

const buildSiteBundle = Effect.tryPromise({
  try: async () => {
    const entryPoints = {
      core: path.join(rootDirectory, "packages/ui/src/core.ts"),
      "eureka-filters": path.join(rootDirectory, "packages/ui/src/eureka-filters.ts"),
      math: path.join(rootDirectory, "packages/ui/src/math.ts")
    } as const

    await build({
      entryPoints,
      bundle: true,
      format: "iife",
      target: "es2022",
      outdir: path.join(jekyllSourceDirectory, "assets/js"),
      entryNames: "[name]",
      minify: false,
      sourcemap: false,
      logLevel: "silent"
    })

    return Object.keys(entryPoints).map((name) =>
      path.join(jekyllSourceDirectory, "assets/js", `${name}.js`)
    )
  },
  catch: assetBuildFailure
})

const copyKatexAssets = Effect.gen(function* () {
  const fileStore = yield* FileStore
  const katexDirectory = path.join(nodeModulesDirectory, "katex/dist")
  const fontsSourceDirectory = path.join(katexDirectory, "fonts")
  const fontsTargetDirectory = path.join(jekyllSourceDirectory, "assets/vendor/katex/fonts")
  const cssTargetPath = path.join(jekyllSourceDirectory, "assets/vendor/katex/katex.min.css")

  yield* fileStore.makeDirectory(fontsTargetDirectory).pipe(Effect.mapError(assetBuildFailure))
  yield* fileStore.copyFile(
    path.join(katexDirectory, "katex.min.css"),
    cssTargetPath
  ).pipe(Effect.mapError(assetBuildFailure))

  const fontEntries = yield* fileStore.readDirectory(fontsSourceDirectory).pipe(Effect.mapError(assetBuildFailure))
  yield* Effect.forEach(fontEntries.filter((entry) => entry.isFile()), (entry) =>
    fileStore.copyFile(
      path.join(fontsSourceDirectory, entry.name),
      path.join(fontsTargetDirectory, entry.name)
    ).pipe(Effect.mapError(assetBuildFailure))
  , { concurrency: 8 })

  return [
    cssTargetPath,
    ...fontEntries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(fontsTargetDirectory, entry.name))
  ]
})

export const buildBrowserAssets = Effect.all([
  buildSiteBundle,
  copyKatexAssets
]).pipe(
  Effect.map(([bundleFiles, vendorFiles]) => [...bundleFiles, ...vendorFiles])
)
