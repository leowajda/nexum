import { Effect } from "effect"
import path from "node:path"
import type { CodeGraphError } from "../core/errors.js"
import { rootDirectory } from "../core/paths.js"
import { CommandRunner, FileStore } from "../core/workspace.js"
import { graphBinaryDirectory, graphWorkspaceDirectory, safeCacheSegment } from "./cache.js"
import { codeGraphError, formatCommandError, mapWorkspaceError } from "./errors.js"
import { resolveCompatibleJavaHome } from "./java-runtime.js"
import type { GraphWorkspaceInput } from "./model.js"

const scipJavaArtifact = "com.sourcegraph:scip-java_2.13:0.12.3"
const scipPythonCommand = ["pnpm", "exec", "scip-python"] as const
const scipClangVersion = "v0.4.0"
const scipClangDownloadUrl = `https://github.com/sourcegraph/scip-clang/releases/download/${scipClangVersion}/scip-clang-x86_64-linux`
const scipClangBinaryPath = path.join(graphBinaryDirectory, `scip-clang-${scipClangVersion}`)

const runCommandOrFail = (
  workspace: GraphWorkspaceInput,
  workingDirectory: string,
  phase: string,
  command: string,
  args: ReadonlyArray<string>
) =>
  Effect.gen(function* () {
    const commandRunner = yield* CommandRunner
    yield* commandRunner.runCommand(workingDirectory, command, args).pipe(
      Effect.mapError(mapWorkspaceError(workspace, phase, formatCommandError))
    )
  })

const ensureScipClangBinary = (workspace: GraphWorkspaceInput) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const commandRunner = yield* CommandRunner
    const exists = yield* fileStore.fileExists(scipClangBinaryPath)
    const binarySize = exists
      ? yield* fileStore.readBytes(scipClangBinaryPath).pipe(
          Effect.map((content) => content.length),
          Effect.catchAll(() => Effect.succeed(0))
        )
      : 0
    const isUsable = exists && binarySize > 100_000_000
      ? yield* commandRunner.runCommand(rootDirectory, scipClangBinaryPath, ["--help"]).pipe(
          Effect.as(true),
          Effect.catchAll(() => Effect.succeed(false))
        )
      : false

    if (!isUsable) {
      const temporaryPath = `${scipClangBinaryPath}.download`

      yield* fileStore.makeDirectory(graphBinaryDirectory).pipe(
        Effect.mapError(mapWorkspaceError(workspace, "scip-clang-directory"))
      )
      yield* runCommandOrFail(
        workspace,
        rootDirectory,
        "scip-clang-download",
        "curl",
        ["-L", scipClangDownloadUrl, "-o", temporaryPath]
      )
      yield* runCommandOrFail(
        workspace,
        rootDirectory,
        "scip-clang-promote",
        "mv",
        [temporaryPath, scipClangBinaryPath]
      )
    }

    yield* runCommandOrFail(
      workspace,
      rootDirectory,
      "scip-clang-permissions",
      "chmod",
      ["+x", scipClangBinaryPath]
    )

    return scipClangBinaryPath
  })

const configureCppWorkspace = (workspace: GraphWorkspaceInput) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const buildDirectory = path.join(
      graphWorkspaceDirectory,
      safeCacheSegment(workspace.project_slug),
      safeCacheSegment(workspace.workspace_slug),
      "cmake-build"
    )

    yield* fileStore.makeDirectory(buildDirectory).pipe(
      Effect.mapError(mapWorkspaceError(workspace, "cmake-directory"))
    )
    yield* runCommandOrFail(
      workspace,
      workspace.root_path,
      "cmake-configure",
      "cmake",
      ["-S", workspace.root_path, "-B", buildDirectory, "-DCMAKE_EXPORT_COMPILE_COMMANDS=ON"]
    )

    return path.join(buildDirectory, "compile_commands.json")
  })

export const runWorkspaceIndexer = (
  workspace: GraphWorkspaceInput,
  outputPath: string
): Effect.Effect<void, CodeGraphError, FileStore | CommandRunner> =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    yield* fileStore.makeDirectory(path.dirname(outputPath)).pipe(
      Effect.mapError(mapWorkspaceError(workspace, "index-output-directory"))
    )

    switch (workspace.kind) {
      case "scip-java": {
        const javaHome = yield* resolveCompatibleJavaHome(workspace)
        yield* runCommandOrFail(
          workspace,
          workspace.root_path,
          "scip-java-index",
          "env",
          [
            `JAVA_HOME=${javaHome}`,
            `PATH=${path.join(javaHome, "bin")}:${process.env.PATH ?? ""}`,
            "cs",
            "launch",
            scipJavaArtifact,
            "-M",
            "com.sourcegraph.scip_java.ScipJava",
            "--",
            "index",
            "--output",
            outputPath
          ]
        )
        return
      }
      case "scip-python":
        yield* runCommandOrFail(
          workspace,
          rootDirectory,
          "scip-python-index",
          scipPythonCommand[0],
          [
            scipPythonCommand[1],
            scipPythonCommand[2],
            "index",
            "--cwd",
            workspace.root_path,
            "--project-name",
            workspace.workspace_slug,
            "--output",
            outputPath
          ]
        )
        return
      case "scip-clang": {
        const binaryPath = yield* ensureScipClangBinary(workspace)
        const compilationDatabase = yield* configureCppWorkspace(workspace)
        yield* runCommandOrFail(
          workspace,
          workspace.root_path,
          "scip-clang-index",
          binaryPath,
          [
            `--compdb-path=${compilationDatabase}`,
            `--index-output-path=${outputPath}`
          ]
        )
        return
      }
    }
  })
