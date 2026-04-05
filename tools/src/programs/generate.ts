import { Effect, Schema } from "effect"
import { build } from "esbuild"
import { execFile } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"
import yaml from "yaml"

const execFileAsync = promisify(execFile)

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const themeSourceDirectory = path.join(rootDirectory, "packages/theme/src")
const siteSourceDirectory = path.join(rootDirectory, "site-src")
const generatedSiteDirectory = path.join(rootDirectory, "site")
const projectsDirectory = path.join(rootDirectory, "projects")
const nodeModulesDirectory = path.join(rootDirectory, "node_modules")

const ProjectManifestSchema = Schema.Struct({
  slug: Schema.String,
  title: Schema.String,
  description: Schema.String,
  route_base: Schema.String,
  source_repo_path: Schema.String
})

type ProjectManifest = Schema.Schema.Type<typeof ProjectManifestSchema>

type ProblemRecord = {
  name: string
  url: string
  difficulty: string
  categories?: ReadonlyArray<string>
  [key: string]: unknown
}

const writeText = (filePath: string, content: string) =>
  Effect.tryPromise({
    try: async () => {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content, "utf8")
    },
    catch: (error) => new Error(`Unable to write ${filePath}: ${String(error)}`)
  })

const readText = (filePath: string) =>
  Effect.tryPromise({
    try: () => fs.readFile(filePath, "utf8"),
    catch: (error) => new Error(`Unable to read ${filePath}: ${String(error)}`)
  })

const copyFile = (fromPath: string, toPath: string) =>
  Effect.tryPromise({
    try: async () => {
      await fs.mkdir(path.dirname(toPath), { recursive: true })
      await fs.copyFile(fromPath, toPath)
    },
    catch: (error) => new Error(`Unable to copy ${fromPath} -> ${toPath}: ${String(error)}`)
  })

const removeDirectory = (directory: string) =>
  Effect.tryPromise({
    try: () => fs.rm(directory, { recursive: true, force: true }),
    catch: (error) => new Error(`Unable to remove ${directory}: ${String(error)}`)
  })

const readDirectory = (directory: string) =>
  Effect.tryPromise({
    try: () => fs.readdir(directory, { withFileTypes: true }),
    catch: (error) => new Error(`Unable to read directory ${directory}: ${String(error)}`)
  })

const fileExists = (filePath: string) =>
  Effect.promise(() => fs.access(filePath).then(() => true).catch(() => false))

const copyDirectoryContents = (fromDirectory: string, toDirectory: string): Effect.Effect<void, Error> =>
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
    }, { concurrency: "inherit", discard: true })
  })

const runGit = (workingDirectory: string, ...args: ReadonlyArray<string>) =>
  Effect.tryPromise({
    try: async () => {
      const { stdout } = await execFileAsync("git", [...args], { cwd: workingDirectory })
      return stdout.trim()
    },
    catch: (error) => new Error(`git ${args.join(" ")} failed in ${workingDirectory}: ${String(error)}`)
  })

const parseYaml = <T>(raw: string, decoder: (input: unknown) => Effect.Effect<T, unknown>) =>
  Effect.try({
    try: () => yaml.parse(raw),
    catch: (error) => new Error(`Unable to parse YAML: ${String(error)}`)
  }).pipe(Effect.flatMap((value) => decoder(value).pipe(Effect.mapError((error) => new Error(String(error))))))

const loadProjectManifests = Effect.gen(function* () {
  const entries = yield* readDirectory(projectsDirectory)
  const manifestFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
  return yield* Effect.forEach(manifestFiles, (entry) =>
    readText(path.join(projectsDirectory, entry.name)).pipe(
      Effect.flatMap((content) => parseYaml(content, Schema.decodeUnknown(ProjectManifestSchema)))
    )
  )
})

const localSourcePath = (sourceRoot: string, githubUrl: string): string | null => {
  const match = githubUrl.match(/^https:\/\/github\.com\/[^/]+\/([^/]+)\/blob\/[^/]+\/(.+)$/)
  if (!match) {
    return null
  }

  return path.join(sourceRoot, match[1], match[2])
}

const humanLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9_-]/g, "-")

const languageMeta = {
  java: { label: "Java", code: "java" },
  scala: { label: "Scala", code: "scala" },
  cpp: { label: "C++", code: "cpp" },
  python: { label: "Python", code: "python" }
} as const

const languageOrder = ["java", "scala", "cpp", "python"] as const

const buildEurekaProject = (manifest: ProjectManifest) =>
  Effect.gen(function* () {
    const sourceRoot = path.join(rootDirectory, manifest.source_repo_path)
    const problemsRaw = yield* readText(path.join(sourceRoot, "_data/problems.yml"))
    const parsed = yaml.parse(problemsRaw) as { problems?: Record<string, ProblemRecord> }
    const sourceUrl = yield* runGit(sourceRoot, "remote", "get-url", "origin")
    const problems = parsed.problems || {}

    const projectCards = {
      slug: manifest.slug,
      title: manifest.title,
      description: manifest.description,
      url: `${manifest.route_base}/`,
      source_url: sourceUrl.replace(/\.git$/, "")
    }

    const problemPages: Record<string, unknown> = {}
    const problemsView: Array<Record<string, unknown>> = []
    const categories = new Set<string>()
    const languagesSeen = new Set<string>()

    for (const [slug, rawProblem] of Object.entries(problems)) {
      const implementations: Array<Record<string, unknown>> = []

      for (const [language, languagePayload] of Object.entries(rawProblem)) {
        if (["name", "url", "difficulty", "categories"].includes(language)) {
          continue
        }

        if (typeof languagePayload !== "object" || languagePayload === null) {
          continue
        }

        const meta = languageMeta[language as keyof typeof languageMeta] ?? { label: humanLabel(language), code: language }

        for (const [approach, githubUrl] of Object.entries(languagePayload as Record<string, string>)) {
          const sourcePath = localSourcePath(sourceRoot, githubUrl)
          const code = sourcePath && (yield* fileExists(sourcePath)) ? yield* readText(sourcePath) : ""
          const implementationId = slugify(`${language}-${approach}`)

          implementations.push({
            id: implementationId,
            language,
            language_label: meta.label,
            approach,
            approach_label: humanLabel(approach),
            source_url: githubUrl,
            source_path: sourcePath ? path.relative(rootDirectory, sourcePath) : null,
            code,
            code_language: meta.code,
            available: code.length > 0,
            detail_url: `${manifest.route_base}/problems/${slug}/?implementation=${implementationId}`
          })
        }
      }

      implementations.sort((left, right) => {
        const leftIndex = languageOrder.indexOf(left.language as (typeof languageOrder)[number])
        const rightIndex = languageOrder.indexOf(right.language as (typeof languageOrder)[number])
        return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
          || String(left.approach_label).localeCompare(String(right.approach_label))
      })

      const implementationsByLanguage = new Map<string, Array<Record<string, unknown>>>()
      implementations.forEach((implementation) => {
        const language = String(implementation.language)
        const group = implementationsByLanguage.get(language) ?? []
        group.push(implementation)
        implementationsByLanguage.set(language, group)
      })

      const languages = languageOrder
        .filter((language) => implementationsByLanguage.has(language))
        .map((language) => ({
          slug: language,
          label: languageMeta[language].label,
          count: implementationsByLanguage.get(language)?.length ?? 0
        }))

      languages.forEach((language) => languagesSeen.add(language.slug))
      rawProblem.categories?.forEach((category) => categories.add(category))

      const problemPage = {
        slug,
        name: rawProblem.name,
        url: rawProblem.url,
        difficulty: rawProblem.difficulty,
        difficulty_slug: rawProblem.difficulty.toLowerCase(),
        categories: rawProblem.categories ?? [],
        languages,
        implementations,
        implementation_count: implementations.length,
        detail_url: `${manifest.route_base}/problems/${slug}/`,
        embed_url: `${manifest.route_base}/problems/${slug}/embed/`
      }

      problemPages[slug] = problemPage
      problemsView.push({
        slug,
        name: rawProblem.name,
        url: rawProblem.url,
        difficulty: rawProblem.difficulty,
        difficulty_slug: rawProblem.difficulty.toLowerCase(),
        categories: rawProblem.categories ?? [],
        languages,
        implementation_count: implementations.length,
        detail_url: `${manifest.route_base}/problems/${slug}/`,
        embed_url: `${manifest.route_base}/problems/${slug}/embed/`,
        search_name: rawProblem.name.toLowerCase()
      })

      const frontMatter = (embed: boolean) => {
        const payload = {
          layout: embed ? "problem_embed" : "problem",
          title: rawProblem.name,
          description: `${rawProblem.name} solutions`,
          problem_slug: slug,
          project_key: manifest.slug,
          permalink: embed ? `${manifest.route_base}/problems/${slug}/embed/` : `${manifest.route_base}/problems/${slug}/`,
          body_class: embed ? "" : "page-wide",
          custom_js: ["eureka"]
        }
        return `---\n${yaml.stringify(payload)}---\n`
      }

      yield* writeText(path.join(generatedSiteDirectory, manifest.slug, "problems", slug, "index.md"), frontMatter(false))
      yield* writeText(path.join(generatedSiteDirectory, manifest.slug, "problems", slug, "embed", "index.md"), frontMatter(true))
    }

    yield* writeText(path.join(generatedSiteDirectory, "_data/generated/eureka/problem_pages.yml"), yaml.stringify(problemPages))
    yield* writeText(path.join(generatedSiteDirectory, "_data/generated/eureka/problems_view.yml"), yaml.stringify(problemsView))
    yield* writeText(path.join(generatedSiteDirectory, "_data/generated/eureka/problem_filters.yml"), yaml.stringify({
      difficulties: ["Easy", "Medium", "Hard"],
      categories: Array.from(categories).sort(),
      languages: languageOrder.filter((language) => languagesSeen.has(language)).map((language) => ({
        slug: language,
        label: languageMeta[language].label
      }))
    }))

    return projectCards
  })

const buildBrowserAssets = Effect.tryPromise({
  try: async () => {
    await build({
      entryPoints: {
        site: path.join(rootDirectory, "packages/ui/src/site.ts"),
        eureka: path.join(rootDirectory, "packages/ui/src/eureka.ts")
      },
      bundle: true,
      format: "iife",
      target: "es2022",
      outdir: path.join(generatedSiteDirectory, "assets/js"),
      minify: false,
      sourcemap: false,
      logLevel: "silent"
    })

    const katexDirectory = path.join(nodeModulesDirectory, "katex/dist")
    await fs.mkdir(path.join(generatedSiteDirectory, "assets/vendor/katex/fonts"), { recursive: true })
    await fs.copyFile(path.join(katexDirectory, "katex.min.css"), path.join(generatedSiteDirectory, "assets/vendor/katex/katex.min.css"))

    const fontEntries = await fs.readdir(path.join(katexDirectory, "fonts"))
    await Promise.all(fontEntries.map((entry) =>
      fs.copyFile(path.join(katexDirectory, "fonts", entry), path.join(generatedSiteDirectory, "assets/vendor/katex/fonts", entry))
    ))
  },
  catch: (error) => new Error(`Unable to build browser assets: ${String(error)}`)
})

export const generateSite = Effect.gen(function* () {
  const manifests = yield* loadProjectManifests

  yield* removeDirectory(generatedSiteDirectory)
  yield* copyDirectoryContents(themeSourceDirectory, generatedSiteDirectory)
  yield* copyDirectoryContents(siteSourceDirectory, generatedSiteDirectory)

  const projectCards = [] as Array<Record<string, string>>
  for (const manifest of manifests) {
    if (manifest.slug === "eureka") {
      projectCards.push(yield* buildEurekaProject(manifest))
    }
  }

  yield* writeText(path.join(generatedSiteDirectory, "_data/generated/projects.yml"), yaml.stringify(projectCards))
  yield* buildBrowserAssets
})
