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
title: Monad.scala
tree_path: src/main/scala/hierarchy/Monad.scala
source_path: scala/cats/src/main/scala/hierarchy/Monad.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats/src/main/scala/hierarchy/Monad.scala
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
document_id: scala:cats:src/main/scala/hierarchy/Monad.scala
description: Monad.scala notes
---

~~~scala
package com.zibaldone.cats
package hierarchy

trait Monad[F[_]] extends Applicative[F] with FlatMap[F]:

  override def map[A, B](fa: F[A])(f: A => B): F[B]         = flatMap(fa)(a => pure(f(a)))
  override def product[A, B](fa: F[A], fb: F[B]): F[(A, B)] = flatMap(fa)(a => map(fb)(b => (a, b)))
~~~
