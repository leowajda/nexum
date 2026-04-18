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
title: applicative.scala
tree_path: src/main/scala/ch_03/applicative.scala
source_path: scala/cats/src/main/scala/ch_03/applicative.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_03/applicative.scala
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
document_id: scala:cats:src/main/scala/ch_03/applicative.scala
description: applicative.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_03

// cats.data.Validated can't be a Monad, but it still qualifies as an Applicative
trait `applicative`[F[_]] extends ch_03.`apply`[F]:
  def pure[A](a: A): F[A]

object `applicative`:

  extension [A](any: A)
    def lift[F[_]: `applicative` as applicative]: F[A] = applicative.pure(any)

import cats.Applicative

// ex. product in terms of applicative
def productWithApplicative[F[_]: Applicative as applicative, A, B](fa: F[A], fb: F[B]): F[(A, B)] =
  val ff: F[A => (A, B)] = applicative.map(fb)(b => (a: A) => (a, b))
  applicative.ap(ff)(fa) // def ap[F[_], A, B](ff: F[A => B])(fa: F[A]): F[B]
~~~
