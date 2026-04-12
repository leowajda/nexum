import assert from "node:assert/strict"
import test from "node:test"
import type { GraphArtifact, GraphWorkspaceInput } from "../src/graph/model.js"
import { buildCodeReferencesPanel } from "../src/graph/projector.js"

const workspace: GraphWorkspaceInput = {
  project_slug: "demo",
  workspace_slug: "core",
  root_path: "/tmp/demo",
  kind: "scip-java",
  primary_language: "java",
  source_extensions: [".java"],
  documents: [
    { id: "alpha", workspace_relative_path: "src/Alpha.java", title: "Alpha.java", language: "java" },
    { id: "beta", workspace_relative_path: "src/Beta.java", title: "Beta.java", language: "java" }
  ],
  resolve_file: (workspaceRelativePath) => {
    switch (workspaceRelativePath) {
      case "src/Alpha.java":
        return {
          title: "Alpha.java",
          language: "java",
          url: "/alpha/",
          url_kind: "internal",
          description: workspaceRelativePath
        }
      case "src/Beta.java":
        return {
          title: "Beta.java",
          language: "java",
          url: "/beta/",
          url_kind: "internal",
          description: workspaceRelativePath
        }
      case "src/Gamma.java":
        return {
          title: "Gamma.java",
          language: "java",
          url: "https://example.com/Gamma.java",
          url_kind: "external",
          description: workspaceRelativePath
        }
      default:
        return null
    }
  }
}

const artifact: GraphArtifact = {
  version: 4,
  project_slug: "demo",
  workspace_slug: "core",
  root_path: "/tmp/demo",
  primary_language: "java",
  references: [
    {
      id: "alpha:beta",
      source_file_path: "src/Alpha.java",
      target_file_path: "src/Beta.java"
    },
    {
      id: "alpha:beta-duplicate",
      source_file_path: "src/Alpha.java",
      target_file_path: "src/Beta.java"
    },
    {
      id: "gamma:alpha",
      source_file_path: "src/Gamma.java",
      target_file_path: "src/Alpha.java"
    },
    {
      id: "self",
      source_file_path: "src/Alpha.java",
      target_file_path: "src/Alpha.java"
    }
  ]
}

test("buildCodeReferencesPanel deduplicates and sorts uses and used_by", () => {
  const panel = buildCodeReferencesPanel(artifact, workspace, workspace.documents[0]!)

  assert.ok(panel)
  assert.equal(panel.focus_file_path, "src/Alpha.java")
  assert.deepEqual(panel.uses, [
    {
      title: "Beta.java",
      file_path: "src/Beta.java",
      language: "java",
      url: "/beta/",
      url_kind: "internal"
    }
  ])
  assert.deepEqual(panel.used_by, [
    {
      title: "Gamma.java",
      file_path: "src/Gamma.java",
      language: "java",
      url: "https://example.com/Gamma.java",
      url_kind: "external"
    }
  ])
})

test("buildCodeReferencesPanel returns null when a document has no graph edges", () => {
  const isolatedWorkspace: GraphWorkspaceInput = {
    ...workspace,
    documents: [
      ...workspace.documents,
      { id: "delta", workspace_relative_path: "src/Delta.java", title: "Delta.java", language: "java" }
    ]
  }

  const panel = buildCodeReferencesPanel(artifact, isolatedWorkspace, isolatedWorkspace.documents[2]!)
  assert.equal(panel, null)
})
