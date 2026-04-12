import assert from "node:assert/strict"
import test from "node:test"
import { normalizeRemoteUrl, toPosixPath } from "../src/core/repository.js"

test("normalizeRemoteUrl converts GitHub SSH remotes to https", () => {
  assert.equal(
    normalizeRemoteUrl("git@github.com:leowajda/leowajda.github.io.git"),
    "https://github.com/leowajda/leowajda.github.io"
  )
})

test("normalizeRemoteUrl strips a trailing .git from https remotes", () => {
  assert.equal(
    normalizeRemoteUrl("https://github.com/leowajda/leowajda.github.io.git"),
    "https://github.com/leowajda/leowajda.github.io"
  )
})

test("toPosixPath normalizes Windows-style separators", () => {
  assert.equal(toPosixPath("some\\nested\\path"), "some/nested/path")
})
