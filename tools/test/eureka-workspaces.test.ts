import assert from "node:assert/strict"
import path from "node:path"
import test from "node:test"
import { buildEurekaGraphWorkspaces, localSourcePath, type EurekaGraphDocument } from "../src/projects/eureka/workspaces.js"

test("localSourcePath maps GitHub blob URLs into local repository paths", () => {
  assert.equal(
    localSourcePath("/tmp/sources", "https://github.com/example/eureka-java/blob/main/src/array/TwoSum.java"),
    path.join("/tmp/sources", "eureka-java", "src/array/TwoSum.java")
  )
  assert.equal(localSourcePath("/tmp/sources", "https://example.com/not-github"), null)
})

test("buildEurekaGraphWorkspaces groups documents by workspace root and resolves internal/external files", () => {
  const documents: ReadonlyArray<EurekaGraphDocument> = [
    {
      key: "java:iterative:https://github.com/example/eureka-java/blob/main/src/array/TwoSum.java",
      languageSlug: "java",
      title: "TwoSum.java",
      detailUrl: "/eureka/problems/two-sum/?language=java&implementation=java-iterative",
      workspaceRoot: "/tmp/sources/eureka-java",
      workspaceRelativePath: "src/array/TwoSum.java"
    }
  ]

  const workspaces = buildEurekaGraphWorkspaces(
    "eureka",
    "/tmp/sources",
    documents,
    new Map([
      ["/tmp/sources/eureka-java", { branch: "main", sourceUrl: "https://github.com/example/eureka-java" }]
    ])
  )

  assert.equal(workspaces.length, 1)
  assert.equal(workspaces[0]?.workspace_slug, "eureka-java")
  assert.equal(workspaces[0]?.documents[0]?.workspace_relative_path, "src/array/TwoSum.java")
  assert.equal(
    workspaces[0]?.resolve_file("src/array/TwoSum.java")?.url,
    "/eureka/problems/two-sum/?language=java&implementation=java-iterative"
  )
  assert.equal(
    workspaces[0]?.resolve_file("src/graph/Node.java")?.url,
    "https://github.com/example/eureka-java/blob/main/src/graph/Node.java"
  )
})
