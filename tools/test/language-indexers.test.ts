import assert from "node:assert/strict"
import test from "node:test"
import {
  buildScipClangIndexCommand,
  buildScipJavaIndexCommand,
  buildScipPythonIndexCommand
} from "../src/graph/language-indexers.js"
import type { GraphWorkspaceInput } from "../src/graph/model.js"

const javaWorkspace: GraphWorkspaceInput = {
  project_slug: "demo",
  workspace_slug: "java-core",
  root_path: "/tmp/demo/java-core",
  kind: "scip-java",
  primary_language: "java",
  source_extensions: [".java"],
  documents: [],
  resolve_file: () => null
}

const pythonWorkspace: GraphWorkspaceInput = {
  project_slug: "demo",
  workspace_slug: "python-core",
  root_path: "/tmp/demo/python-core",
  kind: "scip-python",
  primary_language: "python",
  source_extensions: [".py"],
  documents: [],
  resolve_file: () => null
}

const clangWorkspace: GraphWorkspaceInput = {
  project_slug: "demo",
  workspace_slug: "clang-core",
  root_path: "/tmp/demo/clang-core",
  kind: "scip-clang",
  primary_language: "cpp",
  source_extensions: [".cpp", ".h"],
  documents: [],
  resolve_file: () => null
}

test("buildScipJavaIndexCommand wires JAVA_HOME and output path", () => {
  const command = buildScipJavaIndexCommand(javaWorkspace, "/opt/jdk-21", "/tmp/output/index.scip")

  assert.equal(command.command, "env")
  assert.equal(command.phase, "scip-java-index")
  assert.equal(command.workingDirectory, "/tmp/demo/java-core")
  assert.equal(command.args.includes("JAVA_HOME=/opt/jdk-21"), true)
  assert.equal(command.args.at(-1), "/tmp/output/index.scip")
})

test("buildScipPythonIndexCommand points scip-python at the workspace root", () => {
  const command = buildScipPythonIndexCommand(pythonWorkspace, "/tmp/output/index.scip")

  assert.equal(command.command, "pnpm")
  assert.deepEqual(command.args.slice(0, 4), ["exec", "scip-python", "index", "--cwd"])
  assert.equal(command.args.includes("/tmp/demo/python-core"), true)
})

test("buildScipClangIndexCommand passes compilation database and output path", () => {
  const command = buildScipClangIndexCommand(
    clangWorkspace,
    "/tmp/bin/scip-clang",
    "/tmp/build/compile_commands.json",
    "/tmp/output/index.scip"
  )

  assert.equal(command.command, "/tmp/bin/scip-clang")
  assert.deepEqual(command.args, [
    "--compdb-path=/tmp/build/compile_commands.json",
    "--index-output-path=/tmp/output/index.scip"
  ])
})
