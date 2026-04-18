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
title: kleisli.scala
tree_path: src/main/scala/ch_04/kleisli.scala
source_path: scala/cats/src/main/scala/ch_04/kleisli.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_04/kleisli.scala
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
document_id: scala:cats:src/main/scala/ch_04/kleisli.scala
description: kleisli.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_04

final case class `kleisli`[F[_], A, B](run: A => F[B])

import cats.data.Kleisli

// ex. kleisli Id
// type Reader[-A, B] = ReaderT[Id, A, B]
// type ReaderT[F[_], -A, B] = Kleisli[F, A, B]
type IdKleisli[A, B] = Kleisli[cats.Id, A, B]
~~~
