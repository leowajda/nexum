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
title: Traverse.scala
tree_path: src/main/scala/hierarchy/Traverse.scala
source_path: scala/cats/src/main/scala/hierarchy/Traverse.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/hierarchy/Traverse.scala
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
document_id: scala:cats:src/main/scala/hierarchy/Traverse.scala
description: Traverse.scala notes
---

~~~scala
package com.zibaldone.cats
package hierarchy

trait Traverse[F[_]] extends Foldable[F] with Functor[F]:

  def traverse[M[_]: Applicative, A, B](fa: F[A])(f: A => M[B]): M[F[B]]
  def sequence[M[_]: Applicative, A](fa: F[M[A]]): M[F[A]] = traverse(fa)(identity)
~~~
