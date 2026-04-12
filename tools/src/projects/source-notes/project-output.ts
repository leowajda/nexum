import { Effect } from "effect"
import path from "node:path"
import type { CodeReferencesPanel } from "../../../../packages/graph/src/index.js"
import { generatedSiteDirectory } from "../../core/paths.js"
import { encodeYaml } from "../../core/yaml.js"
import type { ProjectManifest } from "../schema.js"
import type { GeneratedTextFile, ProjectBuild, ProjectCard } from "../types.js"
import type { PageAsset } from "./assets.js"
import type { BuiltModule } from "./module-builder.js"
import { SourceNotesProjectDataSchema, type SourceNotesProjectData } from "./schema.js"

export const buildSourceNotesCard = (manifest: ProjectManifest, sourceUrl: string): ProjectCard => ({
  slug: manifest.slug,
  title: manifest.title,
  description: manifest.description,
  url: `${manifest.route_base}/`,
  source_url: sourceUrl
})

export const attachReferencePanels = (
  builtModules: ReadonlyArray<BuiltModule>,
  referencePanels: ReadonlyMap<string, CodeReferencesPanel | null>
): ReadonlyArray<BuiltModule> =>
  builtModules.map((module) => ({
    ...module,
    module: {
      ...module.module,
      documents: module.module.documents.map((document) => ({
        ...document,
        code_references: document.format === "code" ? (referencePanels.get(document.id) ?? null) : null
      }))
    }
  }))

export const buildSourceNotesProjectData = (
  manifest: ProjectManifest,
  sourceUrl: string,
  heroImageUrl: string,
  builtModules: ReadonlyArray<BuiltModule>
): SourceNotesProjectData => ({
  project: {
    slug: manifest.slug,
    title: manifest.title,
    description: manifest.description,
    url: `${manifest.route_base}/`,
    source_url: sourceUrl,
    hero_image_url: heroImageUrl
  },
  modules: builtModules.map((module) => module.module)
})

const buildSourceNotesDataFile = (
  manifestSlug: string,
  projectData: SourceNotesProjectData
) =>
  encodeYaml(
    `Unable to encode generated source notes for '${manifestSlug}'`,
    SourceNotesProjectDataSchema,
    projectData
  ).pipe(
    Effect.map((content) => ({
      path: path.join(generatedSiteDirectory, `_data/generated/${manifestSlug}/source_notes.yml`),
      content
    } satisfies GeneratedTextFile))
  )

export const assembleSourceNotesProject = (
  manifest: ProjectManifest,
  sourceUrl: string,
  repoReadme: Pick<PageAsset, "assets" | "firstImageUrl">,
  builtModules: ReadonlyArray<BuiltModule>,
  referencePanels: ReadonlyMap<string, CodeReferencesPanel | null>
) =>
  Effect.gen(function* () {
    const modulesWithReferences = attachReferencePanels(builtModules, referencePanels)
    const projectData = buildSourceNotesProjectData(
      manifest,
      sourceUrl,
      repoReadme.firstImageUrl,
      modulesWithReferences
    )
    const dataFile = yield* buildSourceNotesDataFile(manifest.slug, projectData)

    return {
      card: buildSourceNotesCard(manifest, sourceUrl),
      files: [dataFile, ...modulesWithReferences.flatMap((module) => module.files)],
      assets: [...repoReadme.assets, ...modulesWithReferences.flatMap((module) => module.assets)]
    } satisfies ProjectBuild
  })
