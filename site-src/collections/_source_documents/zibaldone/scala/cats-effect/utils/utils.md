---
project_slug: zibaldone
project_title: Zibaldone
project_url: "/zibaldone/"
project_source_url: https://github.com/leowajda/zibaldone
language_slug: scala
language_title: Scala
language_url: "/zibaldone/scala/"
module_slug: cats-effect
module_title: Cats Effect
title: utils.scala
tree_path: src/main/scala/utils/utils.scala
source_path: scala/cats-effect/src/main/scala/utils/utils.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/utils/utils.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats Effect
  url: "/zibaldone/scala/cats-effect/"
- label: utils
  url: ''
document_id: scala:cats-effect:src/main/scala/utils/utils.scala
description: utils.scala notes
---

~~~scala
package utils

import cats.effect.IO

extension [A](io: IO[A])

  def inspect: IO[A] =
    for
      a <- io
      t = Thread.currentThread().getName
      _ = println(s"[$t] - $a")
    yield a
~~~
