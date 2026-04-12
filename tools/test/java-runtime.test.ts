import assert from "node:assert/strict"
import path from "node:path"
import test from "node:test"
import { buildJavaHomeCandidates, compareJavaCandidateNames } from "../src/graph/java-runtime.js"

test("compareJavaCandidateNames prefers Java 21, then 17-20, then current, then older releases", () => {
  const candidates = ["8.0.442-tem", "17.0.10-tem", "21.0.2-tem", "current", "25.0.1-tem"]
  const ordered = [...candidates].sort(compareJavaCandidateNames)

  assert.deepEqual(ordered, ["21.0.2-tem", "17.0.10-tem", "25.0.1-tem", "8.0.442-tem", "current"])
})

test("buildJavaHomeCandidates preserves preference order while removing duplicates", () => {
  const env: NodeJS.ProcessEnv = {
    JAVA21_HOME: "/opt/jdk-21",
    JDK21_HOME: "/opt/jdk-21",
    JAVA17_HOME: "/opt/jdk-17",
    HOME: "/home/demo",
    JAVA_HOME: "/opt/jdk-default"
  }

  const candidates = buildJavaHomeCandidates(
    ["/home/demo/.sdkman/candidates/java/21.0.2-tem", "/home/demo/.sdkman/candidates/java/17.0.10-tem"],
    env
  )

  assert.deepEqual(candidates.slice(0, 5), [
    "/opt/jdk-21",
    "/opt/jdk-17",
    "/home/demo/.sdkman/candidates/java/21.0.2-tem",
    "/home/demo/.sdkman/candidates/java/17.0.10-tem",
    "/usr/lib/jvm/java-21-openjdk-amd64"
  ])
  assert.equal(candidates.includes(path.join("/home/demo", ".sdkman", "candidates", "java", "current")), true)
  assert.equal(candidates.filter((candidate) => candidate === "/opt/jdk-21").length, 1)
})
