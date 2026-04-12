import assert from "node:assert/strict"
import test from "node:test"
import { Effect } from "effect"
import type { CodeReferencesPanel } from "../../packages/graph/src/index.js"
import {
  assembleSourceNotesProject,
  attachReferencePanels,
  buildSourceNotesProjectData
} from "../src/projects/source-notes/project-output.js"
import type { BuiltModule } from "../src/projects/source-notes/module-builder.js"
import type { ProjectManifest } from "../src/projects/schema.js"

const manifest: ProjectManifest = {
  kind: "source-notes",
  slug: "demo",
  title: "Demo",
  description: "Demo project",
  route_base: "/projects/demo",
  source_repo_path: "sources/demo",
  source_optional: false
}

const referencePanel: CodeReferencesPanel = {
  version: 1,
  focus_file_path: "src/Main.java",
  focus_title: "Main.java",
  language: "java",
  uses: [],
  used_by: []
}

const builtModules: ReadonlyArray<BuiltModule> = [
  {
    modulePath: "/tmp/demo/core",
    moduleSlug: "core",
    moduleRelativePath: "core",
    assets: [
      {
        source_path: "/tmp/demo/assets/diagram.png",
        target_path: "/tmp/site/assets/generated/demo/core/diagram.png"
      }
    ],
    files: [
      {
        path: "/tmp/site/demo/core/index.md",
        content: "---\n---\n"
      }
    ],
    module: {
      slug: "core",
      title: "Core",
      url: "/projects/demo/core/",
      source_url: "https://example.com/demo/tree/main/core",
      hero_image_url: "/assets/generated/demo/core/diagram.png",
      language_labels: ["Java"],
      document_count: 2,
      roots: [],
      documents: [
        {
          id: "core:src/Main.java",
          graph_node_id: "demo:core:src/Main.java",
          title: "Main.java",
          url: "/projects/demo/core/main/",
          tree_path: "jvm/src/Main.java",
          source_path: "core/src/Main.java",
          source_url: "https://example.com/demo/blob/main/core/src/Main.java",
          language: "java",
          format: "code",
          breadcrumbs: [],
          code_references: null
        },
        {
          id: "core:README.md",
          graph_node_id: "demo:core:README.md",
          title: "README.md",
          url: "/projects/demo/core/readme/",
          tree_path: "docs/README.md",
          source_path: "core/README.md",
          source_url: "https://example.com/demo/blob/main/core/README.md",
          language: "markdown",
          format: "markdown",
          breadcrumbs: [],
          code_references: null
        }
      ]
    }
  }
]

test("attachReferencePanels only decorates code documents", () => {
  const modulesWithReferences = attachReferencePanels(
    builtModules,
    new Map<string, CodeReferencesPanel>([["core:src/Main.java", referencePanel]])
  )

  assert.equal(modulesWithReferences[0]?.module.documents[0]?.code_references?.focus_title, "Main.java")
  assert.equal(modulesWithReferences[0]?.module.documents[1]?.code_references, null)
})

test("buildSourceNotesProjectData shapes generated source notes data", () => {
  const projectData = buildSourceNotesProjectData(manifest, "https://example.com/demo", "/assets/hero.png", builtModules)

  assert.equal(projectData.project.slug, "demo")
  assert.equal(projectData.project.hero_image_url, "/assets/hero.png")
  assert.equal(projectData.modules[0]?.slug, "core")
})

test("assembleSourceNotesProject composes the generated build output", async () => {
  const build = await Effect.runPromise(assembleSourceNotesProject(
    manifest,
    "https://example.com/demo",
    {
      assets: [
        {
          source_path: "/tmp/demo/README.png",
          target_path: "/tmp/site/assets/generated/demo/project/README.png"
        }
      ],
      firstImageUrl: "/assets/generated/demo/project/README.png"
    },
    builtModules,
    new Map<string, CodeReferencesPanel>([["core:src/Main.java", referencePanel]])
  ))

  assert.equal(build.card.slug, "demo")
  assert.equal(build.files.length, 2)
  assert.equal(build.assets.length, 2)
  assert.equal(build.files[0]?.path.endsWith("/_data/generated/demo/source_notes.yml"), true)
  assert.match(build.files[0]?.content ?? "", /hero_image_url: \/assets\/generated\/demo\/project\/README\.png/)
  assert.match(build.files[0]?.content ?? "", /focus_title: Main\.java/)
})
