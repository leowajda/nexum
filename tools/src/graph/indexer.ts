import { Effect } from "effect"
import path from "node:path"
import { FileStore } from "../core/workspace.js"
import { mapWorkspaceError } from "./errors.js"
import {
  runClangWorkspaceIndexer,
  runJavaWorkspaceIndexer,
  runPythonWorkspaceIndexer
} from "./language-indexers.js"
import type { GraphWorkspaceInput } from "./model.js"

export const runWorkspaceIndexer = (
  workspace: GraphWorkspaceInput,
  outputPath: string
) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    yield* fileStore.makeDirectory(path.dirname(outputPath)).pipe(
      Effect.mapError(mapWorkspaceError(workspace, "index-output-directory"))
    )

    switch (workspace.kind) {
      case "scip-java":
        return yield* runJavaWorkspaceIndexer(workspace, outputPath)
      case "scip-python":
        return yield* runPythonWorkspaceIndexer(workspace, outputPath)
      case "scip-clang":
        return yield* runClangWorkspaceIndexer(workspace, outputPath)
    }
  })
