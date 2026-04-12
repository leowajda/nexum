import { Effect } from "effect"
import path from "node:path"
import { rootDirectory } from "../core/paths.js"
import { CommandRunner } from "../core/workspace.js"
import { formatCommandError, mapWorkspaceError } from "./errors.js"
import { prepareClangWorkspace } from "./clang.js"
import { resolveCompatibleJavaHome } from "./java-runtime.js"
import type { GraphWorkspaceInput } from "./model.js"

const scipJavaArtifact = "com.sourcegraph:scip-java_2.13:0.12.3"
const scipPythonCommand = ["pnpm", "exec", "scip-python"] as const

type WorkspaceIndexCommand = {
  readonly workingDirectory: string
  readonly phase: string
  readonly command: string
  readonly args: ReadonlyArray<string>
}

const runWorkspaceCommandOrFail = (
  workspace: GraphWorkspaceInput,
  specification: WorkspaceIndexCommand
) =>
  Effect.gen(function* () {
    const commandRunner = yield* CommandRunner
    yield* commandRunner.runCommand(specification.workingDirectory, specification.command, specification.args).pipe(
      Effect.mapError(mapWorkspaceError(workspace, specification.phase, formatCommandError))
    )
  })

export const buildScipJavaIndexCommand = (
  workspace: GraphWorkspaceInput,
  javaHome: string,
  outputPath: string
): WorkspaceIndexCommand => ({
  workingDirectory: workspace.root_path,
  phase: "scip-java-index",
  command: "env",
  args: [
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
})

export const buildScipPythonIndexCommand = (
  workspace: GraphWorkspaceInput,
  outputPath: string
): WorkspaceIndexCommand => ({
  workingDirectory: rootDirectory,
  phase: "scip-python-index",
  command: scipPythonCommand[0],
  args: [
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
})

export const buildScipClangIndexCommand = (
  workspace: GraphWorkspaceInput,
  binaryPath: string,
  compilationDatabase: string,
  outputPath: string
): WorkspaceIndexCommand => ({
  workingDirectory: workspace.root_path,
  phase: "scip-clang-index",
  command: binaryPath,
  args: [
    `--compdb-path=${compilationDatabase}`,
    `--index-output-path=${outputPath}`
  ]
})

export const runJavaWorkspaceIndexer = (
  workspace: GraphWorkspaceInput,
  outputPath: string
) =>
  Effect.gen(function* () {
    const javaHome = yield* resolveCompatibleJavaHome(workspace)
    yield* runWorkspaceCommandOrFail(workspace, buildScipJavaIndexCommand(workspace, javaHome, outputPath))
  })

export const runPythonWorkspaceIndexer = (
  workspace: GraphWorkspaceInput,
  outputPath: string
) =>
  runWorkspaceCommandOrFail(workspace, buildScipPythonIndexCommand(workspace, outputPath))

export const runClangWorkspaceIndexer = (
  workspace: GraphWorkspaceInput,
  outputPath: string
) =>
  Effect.gen(function* () {
    const { binaryPath, compilationDatabase } = yield* prepareClangWorkspace(workspace)
    yield* runWorkspaceCommandOrFail(
      workspace,
      buildScipClangIndexCommand(workspace, binaryPath, compilationDatabase, outputPath)
    )
  })
