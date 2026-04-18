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
title: Sync.scala
tree_path: src/main/scala/hierarchy/Sync.scala
source_path: scala/cats-effect/src/main/scala/hierarchy/Sync.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/hierarchy/Sync.scala
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
document_id: scala:cats-effect:src/main/scala/hierarchy/Sync.scala
description: Sync.scala notes
---

~~~scala
package hierarchy

trait Sync[F[_]] extends MonadCancel[F, Throwable] with cats.Defer[F]:

  def delay[A](thunk: => A): F[A]
  def blocking[A](thunk: => A): F[A]

  override def defer[A](thunk: => F[A]): F[A] = flatMap(delay(thunk))(identity)
~~~
