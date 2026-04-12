import { Effect } from "effect"
import path from "node:path"
import { SourceNotesError } from "../../core/errors.js"
import { rootDirectory } from "../../core/paths.js"
import { resolveRepositoryMetadata } from "../../core/repository.js"
import type { ProjectManifest } from "../schema.js"
import type { ProjectAdapter } from "../types.js"
import { buildSourceNotesReferencePanels } from "./graph.js"
import { maybeReadText, rewriteMarkdownAssets } from "./assets.js"
import {
  discoverModuleCandidates
} from "./discovery.js"
import { buildSourceNotesModule } from "./module-builder.js"
import { assembleSourceNotesProject } from "./project-output.js"

const buildSourceNotes = (manifest: ProjectManifest) =>
  Effect.gen(function* () {
    const repoRoot = path.join(rootDirectory, manifest.source_repo_path)
    const gitMetadata = yield* resolveRepositoryMetadata(repoRoot)
    const repoReadmeSource = yield* maybeReadText(path.join(repoRoot, "README.md"))
    const repoReadme = yield* rewriteMarkdownAssets(repoReadmeSource, repoRoot, `${manifest.slug}/project`)
    const moduleCandidates = yield* discoverModuleCandidates(manifest, repoRoot)

    if (moduleCandidates.length === 0) {
      return yield* Effect.fail(new SourceNotesError({
        slug: manifest.slug,
        phase: "discoverModules",
        reason: `No displayable modules found in '${repoRoot}'`
      }))
    }

    const builtModules = yield* Effect.forEach(moduleCandidates, (moduleCandidate) =>
      buildSourceNotesModule(manifest, moduleCandidate, repoRoot, gitMetadata)
    , { concurrency: 4 })

    const referencePanels = yield* buildSourceNotesReferencePanels(
      manifest.slug,
      repoRoot,
      builtModules.map((module) => ({
        modulePath: module.modulePath,
        moduleSlug: module.moduleSlug,
        documents: module.module.documents
      }))
    )

    return yield* assembleSourceNotesProject(
      manifest,
      gitMetadata.sourceUrl,
      repoReadme,
      builtModules,
      referencePanels
    )
  })

export const sourceNotesProjectAdapter: ProjectAdapter = {
  kind: "source-notes",
  build: buildSourceNotes
}
