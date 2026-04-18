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
title: Concurrent.scala
tree_path: src/main/scala/hierarchy/Concurrent.scala
source_path: scala/cats-effect/src/main/scala/hierarchy/Concurrent.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/hierarchy/Concurrent.scala
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
document_id: scala:cats-effect:src/main/scala/hierarchy/Concurrent.scala
description: Concurrent.scala notes
---

~~~scala
package hierarchy

import cats.effect.kernel.{Deferred, Ref}

trait Concurrent[F[_]] extends GenConcurrent[F, Throwable]

trait GenConcurrent[F[_], E] extends GenSpawn[F, E]:

  def ref[A](a: A): F[Ref[F, A]]
  def deferred[A]: F[Deferred[F, A]]
~~~
