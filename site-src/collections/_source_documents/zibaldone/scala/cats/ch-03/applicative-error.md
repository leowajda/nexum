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
title: applicativeError.scala
tree_path: src/main/scala/ch_03/applicativeError.scala
source_path: scala/cats/src/main/scala/ch_03/applicativeError.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_03/applicativeError.scala
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
document_id: scala:cats:src/main/scala/ch_03/applicativeError.scala
description: applicativeError.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_03

trait `applicativeError`[F[_], E] extends ch_03.`applicative`[F]:

  def raiseError[A](e: E): F[A]
  def handleErrorWith[A](fa: F[A])(f: E => F[A]): F[A]
  def handleError[A](fa: F[A])(f: E => A): F[A] = handleErrorWith(fa)(e => pure(f(e)))
~~~
