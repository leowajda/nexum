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
title: apply.scala
tree_path: src/main/scala/ch_03/apply.scala
source_path: scala/cats/src/main/scala/ch_03/apply.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_03/apply.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats
  url: "/zibaldone/scala/cats/"
- label: ch_03
  url: ''
document_id: scala:cats:src/main/scala/ch_03/apply.scala
description: apply.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_03

trait `apply`[F[_]] extends ch_01.`functor`[F] with ch_03.`semigroupal`[F]:

  def ap[A, B](ff: F[A => B])(fa: F[A]): F[B]
  
  override def product[A, B](fa: F[A], fb: F[B]): F[(A, B)] =
    val ff: F[A => (A, B)] = map(fb)(b => (a: A) => (a, b))
    ap(ff)(fa)

  // ex. implement mapN
  def mapN[A, B, C](fa: F[A], fb: F[B])(f: (A, B) => C): F[C] = map(product(fa, fb))(f(_, _))
~~~
