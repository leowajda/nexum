import { Effect } from "effect"
import { GitClient } from "./workspace.js"

export type RepositoryMetadata = {
  readonly branch: string
  readonly sourceUrl: string
}

export const normalizeRemoteUrl = (remoteUrl: string) => {
  if (remoteUrl.startsWith("git@github.com:")) {
    return `https://github.com/${remoteUrl.slice("git@github.com:".length).replace(/\.git$/, "")}`
  }

  return remoteUrl.replace(/\.git$/, "")
}

export const toPosixPath = (value: string) => value.replaceAll("\\", "/")

export const resolveRepositoryMetadata = (repoRoot: string): Effect.Effect<RepositoryMetadata, Error, GitClient> =>
  Effect.gen(function* () {
    const gitClient = yield* GitClient

    const sourceUrl = yield* gitClient.runGit(repoRoot, "remote", "get-url", "origin").pipe(
      Effect.map(normalizeRemoteUrl),
      Effect.catchAll(() => Effect.succeed(""))
    )
    const branch = yield* gitClient.runGit(repoRoot, "rev-parse", "--abbrev-ref", "HEAD").pipe(
      Effect.catchAll(() => Effect.succeed("master"))
    )

    return { branch, sourceUrl }
  })
