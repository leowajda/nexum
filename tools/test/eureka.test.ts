import assert from "node:assert/strict"
import test from "node:test"
import { Effect } from "effect"
import { decodeEurekaSource, buildEurekaModel } from "../src/projects/eureka/model.js"
import type { ProjectManifest } from "../src/projects/schema.js"

const manifest: ProjectManifest = {
  kind: "eureka",
  slug: "eureka",
  title: "Eureka",
  description: "Algorithms",
  route_base: "/eureka",
  source_repo_path: "sources/eureka"
}

test("decodeEurekaSource keeps dynamic languages from source data", async () => {
  const source = await Effect.runPromise(decodeEurekaSource(`
languages:
  rust:
    label: Rust
    code_language: rust
problems:
  two-sum:
    name: Two Sum
    url: https://leetcode.com/problems/two-sum
    difficulty: Easy
    categories: [Array, Hash Table]
    rust:
      iterative: https://github.com/example/eureka-rust/blob/master/src/array/iterative/TwoSum.rs
`))

  assert.deepEqual(Object.keys(source.languages), ["rust"])
  assert.equal(source.languages.rust?.label, "Rust")
  assert.deepEqual(Object.keys(source.problems["two-sum"]?.implementations ?? {}), ["rust"])
})

test("buildEurekaModel generates language pages and filters from source languages", async () => {
  const source = await Effect.runPromise(decodeEurekaSource(`
languages:
  rust:
    label: Rust
    code_language: rust
  kotlin:
    label: Kotlin
    code_language: kotlin
problems:
  valid-parentheses:
    name: Valid Parentheses
    url: https://leetcode.com/problems/valid-parentheses
    difficulty: Easy
    categories: [String, Stack]
    rust:
      iterative: https://github.com/example/eureka-rust/blob/master/src/string/iterative/ValidParentheses.rs
`))

  const model = await Effect.runPromise(buildEurekaModel(manifest, source, () => Effect.succeed("fn main() {}")))

  assert.deepEqual(model.problemFilters.languages, [
    { slug: "rust", label: "Rust" },
    { slug: "kotlin", label: "Kotlin" }
  ])
  assert.ok(model.files.some((file) => file.path.endsWith("site-src/eureka/rust/index.md")))
  assert.ok(model.files.some((file) => file.path.endsWith("site-src/eureka/kotlin/index.md")))
  assert.equal(model.problemPages["valid-parentheses"]?.languages[0]?.label, "Rust")
  assert.equal(model.problemPages["valid-parentheses"]?.implementations[0]?.code_language, "rust")
})

test("decodeEurekaSource rejects unsupported problem keys", async () => {
  await assert.rejects(
    () => Effect.runPromise(decodeEurekaSource(`
languages:
  java:
    label: Java
    code_language: java
problems:
  best-time:
    name: Best Time
    url: https://leetcode.com/problems/best-time-to-buy-and-sell-stock
    difficulty: Easy
    categories: [Array]
    notes:
      owner: leo
    java:
      iterative: https://github.com/example/eureka-java/blob/master/src/array/iterative/BestTime.java
`)),
    /EurekaSourceError/
  )
})
