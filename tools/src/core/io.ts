import { Effect } from "effect"
import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

export const writeText = (filePath: string, content: string) =>
  Effect.tryPromise({
    try: async () => {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content, "utf8")
    },
    catch: (error) => new Error(`Unable to write ${filePath}: ${String(error)}`)
  })

export const readText = (filePath: string) =>
  Effect.tryPromise({
    try: () => fs.readFile(filePath, "utf8"),
    catch: (error) => new Error(`Unable to read ${filePath}: ${String(error)}`)
  })

export const copyFile = (fromPath: string, toPath: string) =>
  Effect.tryPromise({
    try: async () => {
      await fs.mkdir(path.dirname(toPath), { recursive: true })
      await fs.copyFile(fromPath, toPath)
    },
    catch: (error) => new Error(`Unable to copy ${fromPath} -> ${toPath}: ${String(error)}`)
  })

export const removeDirectory = (directory: string) =>
  Effect.tryPromise({
    try: () => fs.rm(directory, { recursive: true, force: true }),
    catch: (error) => new Error(`Unable to remove ${directory}: ${String(error)}`)
  })

export const readDirectory = (directory: string) =>
  Effect.tryPromise({
    try: () => fs.readdir(directory, { withFileTypes: true }),
    catch: (error) => new Error(`Unable to read directory ${directory}: ${String(error)}`)
  })

export const fileExists = (filePath: string) =>
  Effect.promise(() => fs.access(filePath).then(() => true).catch(() => false))

export const copyDirectoryContents = (fromDirectory: string, toDirectory: string): Effect.Effect<void, Error> =>
  Effect.gen(function* () {
    const entries = yield* readDirectory(fromDirectory)
    yield* Effect.tryPromise({
      try: () => fs.mkdir(toDirectory, { recursive: true }),
      catch: (error) => new Error(`Unable to create ${toDirectory}: ${String(error)}`)
    })

    yield* Effect.forEach(entries, (entry) => {
      const sourcePath = path.join(fromDirectory, entry.name)
      const targetPath = path.join(toDirectory, entry.name)

      if (entry.isDirectory()) {
        return Effect.gen(function* () {
          yield* Effect.tryPromise({
            try: () => fs.mkdir(targetPath, { recursive: true }),
            catch: (error) => new Error(`Unable to create ${targetPath}: ${String(error)}`)
          })
          yield* copyDirectoryContents(sourcePath, targetPath)
        })
      }

      return copyFile(sourcePath, targetPath)
    }, { discard: true, concurrency: "inherit" })
  })

export const runGit = (workingDirectory: string, ...args: ReadonlyArray<string>) =>
  Effect.tryPromise({
    try: async () => {
      const { stdout } = await execFileAsync("git", [...args], { cwd: workingDirectory })
      return stdout.trim()
    },
    catch: (error) => new Error(`git ${args.join(" ")} failed in ${workingDirectory}: ${String(error)}`)
  })
