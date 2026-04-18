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
title: ApplicativeError.scala
tree_path: src/main/scala/hierarchy/ApplicativeError.scala
source_path: scala/cats/src/main/scala/hierarchy/ApplicativeError.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/hierarchy/ApplicativeError.scala
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
document_id: scala:cats:src/main/scala/hierarchy/ApplicativeError.scala
description: ApplicativeError.scala notes
---

~~~scala
package com.zibaldone.cats
package hierarchy

trait ApplicativeError[F[_], E] extends Applicative[F]:

  def raiseError[A](e: E): F[A]
  def handleErrorWith[A](fa: F[A])(f: E => F[A]): F[A]
  def handleError[A](fa: F[A])(f: E => A): F[A] = handleErrorWith(fa)(e => pure(f(e)))
~~~
