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
title: monadTransformer.scala
tree_path: src/main/scala/ch_01/monadTransformer.scala
source_path: scala/cats/src/main/scala/ch_01/monadTransformer.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_01/monadTransformer.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats
  url: "/zibaldone/scala/cats/"
- label: ch_01
  url: ''
document_id: scala:cats:src/main/scala/ch_01/monadTransformer.scala
description: monadTransformer.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_01

import cats.data.EitherT
import cats.instances.future.*
import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future

// ex. request spike
final case class AsyncService(bandwidths: Map[String, Int]):

  opaque type AsyncResponse[T] = EitherT[Future, String, T] // Future[Either[String, T]]

  private def bandwidth(server: String): AsyncResponse[Int] = bandwidths.get(server) match
    case None        => EitherT.left { Future.successful("absent") }
    case Some(value) => EitherT.right { Future.successful(value) }

  private def canWithstandSurge(a: String, b: String): AsyncResponse[Boolean] =
    for
      aBandwidth <- bandwidth(a)
      bBandwidth <- bandwidth(b)
    yield aBandwidth + bBandwidth > 250

  def report(a: String, b: String): AsyncResponse[String] = canWithstandSurge(a, b).transform {
    case Left(rootCause) => Left(rootCause)
    case Right(true)     => Right("enough bandwidth")
    case Right(false)    => Left("not enough bandwidth")
  }
~~~
