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
title: contravariant.scala
tree_path: src/main/scala/ch_04/contravariant.scala
source_path: scala/cats/src/main/scala/ch_04/contravariant.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_04/contravariant.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats
  url: "/zibaldone/scala/cats/"
- label: ch_04
  url: ''
document_id: scala:cats:src/main/scala/ch_04/contravariant.scala
description: contravariant.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_04

// contravariant type class
trait Format[T]:

  def format(value: T): String

  // functor applies transformations in order
  // contramap applies transformation in reverse order
  def contramap[A](f: A => T): Format[A] = (a: A) => format(f(a))

trait `contravariant`[F[_]] extends ch_04.`invariant`[F]:

  def contramap[A, B](fa: F[A])(f: B => A): F[B]
  override def imap[A, B](fa: F[A])(forth: A => B)(back: B => A): F[B] = contramap(fa)(back)
~~~
