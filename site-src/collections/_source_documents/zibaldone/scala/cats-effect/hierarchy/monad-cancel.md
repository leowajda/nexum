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
title: MonadCancel.scala
tree_path: src/main/scala/hierarchy/MonadCancel.scala
source_path: scala/cats-effect/src/main/scala/hierarchy/MonadCancel.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/hierarchy/MonadCancel.scala
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
document_id: scala:cats-effect:src/main/scala/hierarchy/MonadCancel.scala
description: MonadCancel.scala notes
---

~~~scala
package hierarchy

// onCancel, guarantee, guaranteeCase, bracket
trait MonadCancel[F[_], E] extends cats.MonadError[F, E]:

  def canceled: F[Unit]
  def uncancelable[A](poll: Poll[F] => F[A]): F[A]

trait Poll[F[_]]:
  def apply[A](fa: F[A]): F[A]
~~~
