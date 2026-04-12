import { Effect } from "effect"
import path from "node:path"
import { rootDirectory } from "../core/paths.js"
import { CommandRunner, FileStore } from "../core/workspace.js"
import { codeGraphError } from "./errors.js"
import type { GraphWorkspaceInput } from "./model.js"

const unique = <A>(values: ReadonlyArray<A>) =>
  Array.from(new Set(values))

export const compareJavaCandidateNames = (left: string, right: string) => {
  const rank = (value: string) => {
    const numericPrefix = Number.parseInt(value, 10)
    if (Number.isNaN(numericPrefix)) {
      return value === "current" ? 0 : -1
    }

    if (numericPrefix === 21) {
      return 700
    }

    if (numericPrefix >= 17 && numericPrefix < 21) {
      return 600 + numericPrefix
    }

    if (numericPrefix < 17) {
      return 200 + numericPrefix
    }

    return 500 - Math.min(numericPrefix, 99)
  }

  return rank(right) - rank(left)
}

export const buildJavaHomeCandidates = (
  sdkmanCandidates: ReadonlyArray<string>,
  env: NodeJS.ProcessEnv
): ReadonlyArray<string> =>
  unique([
    env.JAVA21_HOME,
    env.JDK21_HOME,
    env.JAVA17_HOME,
    env.JDK17_HOME,
    ...sdkmanCandidates,
    "/usr/lib/jvm/java-21-openjdk-amd64",
    "/usr/lib/jvm/java-1.21.0-openjdk-amd64",
    env.JDK_HOME,
    env.JAVA_HOME,
    env.HOME ? path.join(env.HOME, ".sdkman", "candidates", "java", "current") : null
  ].filter((candidate): candidate is string => Boolean(candidate)))

const listSdkmanJavaCandidates = (sdkmanJavaDirectory: string) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore

    return yield* fileStore.readDirectory(sdkmanJavaDirectory).pipe(
      Effect.map((entries) =>
        entries
          .filter((entry) => entry.isDirectory() && entry.name !== "current")
          .map((entry) => path.join(sdkmanJavaDirectory, entry.name))
          .sort((left, right) => compareJavaCandidateNames(path.basename(left), path.basename(right)))
      ),
      Effect.catchAll(() => Effect.succeed([] as ReadonlyArray<string>))
    )
  })

export const resolveCompatibleJavaHome = (workspace: GraphWorkspaceInput) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const commandRunner = yield* CommandRunner
    const sdkmanJavaDirectory = process.env.HOME
      ? path.join(process.env.HOME, ".sdkman", "candidates", "java")
      : null
    const sdkmanCandidates = sdkmanJavaDirectory
      ? yield* listSdkmanJavaCandidates(sdkmanJavaDirectory)
      : []
    const candidates = buildJavaHomeCandidates(sdkmanCandidates, process.env)

    for (const candidate of candidates) {
      const javacExecutable = path.join(candidate, "bin", "javac")
      const javaExecutable = path.join(candidate, "bin", "java")
      const [javaExists, javacExists] = yield* Effect.all([
        fileStore.fileExists(javaExecutable),
        fileStore.fileExists(javacExecutable)
      ])

      if (javaExists && javacExists) {
        return candidate
      }
    }

    const coursierJavaHome = yield* commandRunner.runCommand(rootDirectory, "cs", ["java-home", "--jvm", "temurin:21"]).pipe(
      Effect.map((output) => output.trim()),
      Effect.catchAll(() => Effect.succeed(""))
    )
    if (coursierJavaHome) {
      const javacExecutable = path.join(coursierJavaHome, "bin", "javac")
      const javaExecutable = path.join(coursierJavaHome, "bin", "java")
      const [javaExists, javacExists] = yield* Effect.all([
        fileStore.fileExists(javaExecutable),
        fileStore.fileExists(javacExecutable)
      ])

      if (javaExists && javacExists) {
        return coursierJavaHome
      }
    }

    return yield* Effect.fail(codeGraphError(workspace, "java-runtime", "Unable to resolve a compiler-capable JDK for scip-java"))
  })
