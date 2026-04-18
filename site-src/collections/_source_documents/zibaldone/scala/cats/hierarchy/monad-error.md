---
project_slug: zibaldone
project_title: Zibaldone
project_url: "/zibaldone/"
project_source_url: https://github.com/leowajda/zibaldone
language_slug: scala
language_title: Scala
language_url: "/zibaldone/scala/"
module_slug: cats
module_title: Cats
title: MonadError.scala
tree_path: src/main/scala/hierarchy/MonadError.scala
source_path: scala/cats/src/main/scala/hierarchy/MonadError.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/hierarchy/MonadError.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats
  url: "/zibaldone/scala/cats/"
- label: hierarchy
  url: ''
document_id: scala:cats:src/main/scala/hierarchy/MonadError.scala
description: MonadError.scala notes
---

~~~scala
package com.zibaldone.cats
package hierarchy

trait MonadError[F[_], E] extends ApplicativeError[F, E] with Monad[F]:
  def ensure[A](fa: F[A])(e: => E)(f: E => Boolean): F[A]
~~~
