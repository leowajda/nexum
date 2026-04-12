import { Effect } from "effect"
import { generatedSiteDirectory, siteSourceDirectory, themeSourceDirectory } from "../core/paths.js"
import { FileStore } from "../core/workspace.js"

export const prepareGeneratedSiteDirectory = Effect.gen(function* () {
  const fileStore = yield* FileStore

  yield* fileStore.removeDirectory(generatedSiteDirectory)
  yield* fileStore.copyDirectoryContents(themeSourceDirectory, generatedSiteDirectory)
  yield* fileStore.copyDirectoryContents(siteSourceDirectory, generatedSiteDirectory)
})
