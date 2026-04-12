import { Effect } from "effect"
import type { CodeReferencesPanel } from "../../../../packages/graph/src/index.js"
import { buildCodeReferencePanels } from "../../graph/service.js"
import { resolveRepositoryMetadata } from "../../core/repository.js"
import type { ProjectManifest } from "../schema.js"
import type { EurekaSource } from "./source.js"
import {
  buildEurekaGraphWorkspaces,
  collectEurekaGraphDocuments
} from "./workspaces.js"

export const buildEurekaReferencePanels = (
  manifest: ProjectManifest,
  sourceRoot: string,
  source: EurekaSource
) =>
  Effect.gen(function* () {
    const documents = yield* collectEurekaGraphDocuments(manifest, sourceRoot, source)

    const workspaceRoots = Array.from(new Set(documents.map((document) => document.workspaceRoot)))
    const workspaceMetadataEntries = yield* Effect.forEach(workspaceRoots, (workspaceRoot) =>
      resolveRepositoryMetadata(workspaceRoot).pipe(
        Effect.map((metadata) => [workspaceRoot, metadata] as const)
      )
    )
    const workspaceMetadata = new Map(workspaceMetadataEntries)
    const workspaces = buildEurekaGraphWorkspaces(manifest.slug, sourceRoot, documents, workspaceMetadata)

    return yield* buildCodeReferencePanels(workspaces)
  })
