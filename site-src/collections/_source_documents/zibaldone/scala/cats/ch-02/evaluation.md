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
title: evaluation.scala
tree_path: src/main/scala/ch_02/evaluation.scala
source_path: scala/cats/src/main/scala/ch_02/evaluation.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/ch_02/evaluation.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats
  url: "/zibaldone/scala/cats/"
- label: ch_02
  url: ''
document_id: scala:cats:src/main/scala/ch_02/evaluation.scala
description: evaluation.scala notes
---

~~~scala
package com.zibaldone.cats
package ch_02

import cats.Eval

def mixedEvaluation: Eval[Int]                   =
  for
    a <- Eval.now(40)   // val
    b <- Eval.later(1)  // memo
    c <- Eval.always(1) // def
  yield a + b + c

// ex. implement defer such that defer(Eval.now) does NOT run side effects
def defer[A](expr: => Eval[A]): Eval[A]          =
  for
    _    <- Eval.later(())
    eval <- expr
  yield eval

// ex. reverse linked list
def reverseEval[A](list: List[A]): Eval[List[A]] = list match
  case Nil          => Eval.now(Nil)
  case head :: tail => Eval.defer { reverseEval(tail).map(_ :+ head) } // stack-safe
~~~
