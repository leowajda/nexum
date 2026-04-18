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
title: Apply.scala
tree_path: src/main/scala/hierarchy/Apply.scala
source_path: scala/cats/src/main/scala/hierarchy/Apply.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/hierarchy/Apply.scala
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
document_id: scala:cats:src/main/scala/hierarchy/Apply.scala
description: Apply.scala notes
---

~~~scala
package com.zibaldone.cats
package hierarchy

trait Apply[F[_]] extends Functor[F] with Semigroupal[F]:

  def ap[A, B](ff: F[A => B])(fa: F[A]): F[B]

  override def product[A, B](fa: F[A], fb: F[B]): F[(A, B)] =
    val ff: F[A => (A, B)] = map(fb)(b => (a: A) => (a, b))
    ap(ff)(fa)
~~~
