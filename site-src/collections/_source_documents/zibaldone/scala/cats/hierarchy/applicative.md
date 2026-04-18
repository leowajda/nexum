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
title: Applicative.scala
tree_path: src/main/scala/hierarchy/Applicative.scala
source_path: scala/cats/src/main/scala/hierarchy/Applicative.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/hierarchy/Applicative.scala
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
document_id: scala:cats:src/main/scala/hierarchy/Applicative.scala
description: Applicative.scala notes
---

~~~scala
package com.zibaldone.cats
package hierarchy

trait Applicative[F[_]] extends Apply[F]:
  def pure[A](a: A): F[A]
~~~
