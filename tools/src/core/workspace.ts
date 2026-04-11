import { Context, Effect, Layer } from "effect"
import {
  copyDirectoryContents,
  fileExists,
  readDirectory,
  readText,
  removeDirectory,
  runGit,
  writeText
} from "./io.js"

export interface FileStoreService {
  readonly readDirectory: typeof readDirectory
  readonly readText: typeof readText
  readonly writeText: typeof writeText
  readonly removeDirectory: typeof removeDirectory
  readonly copyDirectoryContents: typeof copyDirectoryContents
  readonly fileExists: typeof fileExists
}

export interface GitService {
  readonly runGit: typeof runGit
  readonly updateSubmodules: (workingDirectory: string) => Effect.Effect<string, Error>
}

export class FileStore extends Context.Tag("FileStore")<FileStore, FileStoreService>() {}
export class GitClient extends Context.Tag("GitClient")<GitClient, GitService>() {}

export const FileStoreLive = Layer.succeed(FileStore, {
  readDirectory,
  readText,
  writeText,
  removeDirectory,
  copyDirectoryContents,
  fileExists
})

export const GitClientLive = Layer.succeed(GitClient, {
  runGit,
  updateSubmodules: (workingDirectory: string) =>
    runGit(workingDirectory, "submodule", "sync", "--recursive").pipe(
      Effect.flatMap(() => runGit(workingDirectory, "submodule", "update", "--init", "--recursive"))
    )
})

export const WorkspaceLive = Layer.mergeAll(FileStoreLive, GitClientLive)
