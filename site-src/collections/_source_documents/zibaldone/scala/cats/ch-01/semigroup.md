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
title: semigroup.scala
tree_path: src/main/scala/ch_01/semigroup.scala
source_path: scala/cats/src/main/scala/ch_01/semigroup.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_01/semigroup.scala
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
document_id: scala:cats:src/main/scala/ch_01/semigroup.scala
description: semigroup.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_01

import cats.Semigroup
import cats.instances.int.*
import cats.syntax.semigroup.*

// will throw an exception on empty iterables
extension [T: Semigroup](iterable: Iterable[T])
  // ex. use extension method
  def reduceIterable: T = iterable.reduce(_ |+| _)

trait `semigroup`[A]:
  def combine(x: A, y: A): A

final case class Expense(id: Long, amount: Double)

object Expense:
  // ex. support new type
  given Semigroup[Expense] = Semigroup.instance { (a, b) => Expense(a.id |+| b.id, a.amount |+| b.amount) }
~~~
