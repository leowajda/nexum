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
title: semigroupal.scala
tree_path: src/main/scala/ch_03/semigroupal.scala
source_path: scala/cats/src/main/scala/ch_03/semigroupal.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_03/semigroupal.scala
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
document_id: scala:cats:src/main/scala/ch_03/semigroupal.scala
description: semigroupal.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_03

import cats.{Monad, Semigroupal}

trait `semigroupal`[F[_]]:
  // Semigroupal doesn't have to be defined in terms of Monad, sometimes that would be illegal.
  def product[A, B](fa: F[A], fb: F[B]): F[(A, B)]

import cats.syntax.flatMap.*
import cats.syntax.functor.*

// ex. implement semigroupal with monad
def productWithMonads[F[_]: Monad, A, B](fa: F[A], fb: F[B]): F[(A, B)] =
  for
    a <- fa
    b <- fb
  yield (a, b)

// Semigroupal[ErrorOrEither] === Monad[ErrorOrEither]
import cats.instances.either.*
type ErrorOrEither[A] = Either[List[String], A]
// because of the short-circuiting in flatMap, 'c' will never be accumulated
val eitherSemigroupal = Semigroupal[ErrorOrEither].product(
  fa = Left("a" :: "b" :: Nil),
  fb = Left("c" :: Nil)
)

import cats.data.Validated
type ErrorOrValidated[A] = Validated[List[String], A]
// Semigroupal[ErrorOrValidated] provides a more flexible definition of product `without` using flatMap
val validatedSemigroupal = Semigroupal[ErrorOrValidated].product(
  fa = Validated.invalid("a" :: "b" :: Nil),
  fb = Validated.invalid("c" :: Nil)
)

// ex. Semigroupal[List] that zips
given Semigroupal[List] = new Semigroupal[List]:
  override def product[A, B](fa: List[A], fb: List[B]): List[(A, B)] = fa.zip(fb)
~~~
