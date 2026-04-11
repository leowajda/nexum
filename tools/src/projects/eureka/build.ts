import { Effect } from "effect"
import path from "node:path"
import { encodeYaml } from "../../core/yaml.js"
import { generatedSiteDirectory, rootDirectory } from "../../core/paths.js"
import { FileStore, GitClient } from "../../core/workspace.js"
import type { ProjectManifest } from "../schema.js"
import type { GeneratedTextFile, ProjectAdapter, ProjectBuild, ProjectCard } from "../types.js"
import { buildEurekaModel, decodeEurekaSource } from "./model.js"
import { ProblemFiltersSchema, ProblemPagesSchema, ProblemsViewSchema } from "./schema.js"

const localSourcePath = (sourceRoot: string, githubUrl: string): string | null => {
  const match = githubUrl.match(/^https:\/\/github\.com\/[^/]+\/([^/]+)\/blob\/[^/]+\/(.+)$/)
  if (!match) {
    return null
  }

  return path.join(sourceRoot, match[1], match[2])
}

const makeYamlFile = <A>(filePath: string, context: string, schema: any, value: A) =>
  encodeYaml(context, schema, value).pipe(
    Effect.map((content) => ({
      path: filePath,
      content
    } satisfies GeneratedTextFile))
  )

const buildCard = (manifest: ProjectManifest, sourceUrl: string): ProjectCard => ({
  slug: manifest.slug,
  title: manifest.title,
  description: manifest.description,
  url: `${manifest.route_base}/`,
  source_url: sourceUrl.replace(/\.git$/, "")
})

const buildEureka = (manifest: ProjectManifest) =>
  Effect.gen(function* () {
    const fileStore = yield* FileStore
    const gitClient = yield* GitClient
    const sourceRoot = path.join(rootDirectory, manifest.source_repo_path)
    const sourceRaw = yield* fileStore.readText(path.join(sourceRoot, "_data/problems.yml"))
    const source = yield* decodeEurekaSource(sourceRaw)
    const sourceUrl = yield* gitClient.runGit(sourceRoot, "remote", "get-url", "origin")
    const model = yield* buildEurekaModel(manifest, source, (githubUrl) => {
      const sourcePath = localSourcePath(sourceRoot, githubUrl)
      if (!sourcePath) {
        return Effect.succeed("")
      }

      return fileStore.fileExists(sourcePath).pipe(
        Effect.flatMap((exists) => exists ? fileStore.readText(sourcePath) : Effect.succeed(""))
      )
    })

    const dataFiles = yield* Effect.all([
      makeYamlFile(
        path.join(generatedSiteDirectory, `_data/generated/${manifest.slug}/problem_pages.yml`),
        `Unable to encode generated problem pages for '${manifest.slug}'`,
        ProblemPagesSchema,
        model.problemPages
      ),
      makeYamlFile(
        path.join(generatedSiteDirectory, `_data/generated/${manifest.slug}/problems_view.yml`),
        `Unable to encode generated problems view for '${manifest.slug}'`,
        ProblemsViewSchema,
        model.problemsView
      ),
      makeYamlFile(
        path.join(generatedSiteDirectory, `_data/generated/${manifest.slug}/problem_filters.yml`),
        `Unable to encode generated problem filters for '${manifest.slug}'`,
        ProblemFiltersSchema,
        model.problemFilters
      )
    ])

    return {
      card: buildCard(manifest, sourceUrl),
      files: [...model.files, ...dataFiles]
    } satisfies ProjectBuild
  })

export const eurekaProjectAdapter: ProjectAdapter = {
  kind: "eureka",
  build: buildEureka
}
