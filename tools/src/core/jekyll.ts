import path from "node:path"
import { jekyllSourceDirectory } from "./paths.js"

export const generatedCollectionFile = (collection: string, ...segments: ReadonlyArray<string>) =>
  path.join(jekyllSourceDirectory, `_${collection}`, ...segments)

export const generatedDataFile = (...segments: ReadonlyArray<string>) =>
  path.join(jekyllSourceDirectory, "_data", "generated", ...segments)

export const generatedPageFile = (...segments: ReadonlyArray<string>) =>
  path.join(jekyllSourceDirectory, ...segments)
