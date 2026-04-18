---
project_slug: zibaldone
project_title: Zibaldone
project_url: "/zibaldone/"
project_source_url: https://github.com/leowajda/zibaldone
language_slug: scala
language_title: Scala
language_url: "/zibaldone/scala/"
module_slug: cats-effect
module_title: Cats Effect
title: Spawn.scala
tree_path: src/main/scala/hierarchy/Spawn.scala
source_path: scala/cats-effect/src/main/scala/hierarchy/Spawn.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/hierarchy/Spawn.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats Effect
  url: "/zibaldone/scala/cats-effect/"
- label: hierarchy
  url: ''
document_id: scala:cats-effect:src/main/scala/hierarchy/Spawn.scala
description: Spawn.scala notes
---

~~~scala
package hierarchy

import cats.effect.kernel.Fiber

trait Spawn[F[_]] extends GenSpawn[F, Throwable]

trait GenSpawn[F[_], E] extends MonadCancel[F, E]:

  def start[A](fa: F[A]): F[Fiber[F, E, A]]
  def never[A]: F[A]
  def cede: F[Unit]
~~~
