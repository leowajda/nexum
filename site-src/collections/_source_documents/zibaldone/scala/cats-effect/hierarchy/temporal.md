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
title: Temporal.scala
tree_path: src/main/scala/hierarchy/Temporal.scala
source_path: scala/cats-effect/src/main/scala/hierarchy/Temporal.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/hierarchy/Temporal.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats Effect
  url: "/zibaldone/scala/cats-effect/"
- label: hierarchy
  url: ''
document_id: scala:cats-effect:src/main/scala/hierarchy/Temporal.scala
description: Temporal.scala notes
---

~~~scala
package hierarchy

import scala.concurrent.duration.FiniteDuration

trait Temporal[F[_]] extends GenTemporal[F, Throwable]

trait GenTemporal[F[_], E] extends GenConcurrent[F, E]:
  def sleep(duration: FiniteDuration): F[Unit]
~~~
