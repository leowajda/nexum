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
title: effects.scala
tree_path: src/main/scala/ch_01/effects.scala
source_path: scala/cats-effect/src/main/scala/ch_01/effects.scala
source_url: https://github.com/leowajda/zibaldone/blob/master/scala/cats-effect/src/main/scala/ch_01/effects.scala
language: scala
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Scala
  url: "/zibaldone/scala/"
- label: Cats Effect
  url: "/zibaldone/scala/cats-effect/"
- label: ch_01
  url: ''
document_id: scala:cats-effect:src/main/scala/ch_01/effects.scala
description: effects.scala notes
---

~~~scala
package ch_01

final case class IO[A](unsafeRun: () => A):

  def map[B](f: A => B): IO[B]         = IO(() => f(unsafeRun()))
  def flatMap[B](f: A => IO[B]): IO[B] = IO(() => f(unsafeRun()).unsafeRun())

// ex. IO which returns the current time
val clock: IO[Long] = IO(() => System.currentTimeMillis())

// ex. IO which measures the duration of a computation
def measure[A](computation: IO[A]): IO[Long] =
  for
    start <- clock
    _     <- computation
    end   <- clock
  yield end - start

// ex. IO which prints to the console
def putStrLn(line: String): IO[Unit] = IO(() => println(line))

// ex. IO which reads from the console
def readStrLn(): IO[String] = IO(() => io.StdIn.readLine())

// IO bridges functional and imperative programming
val program: IO[Unit] =
  for
    _         <- putStrLn("args[0]")
    firstArg  <- readStrLn()
    _         <- putStrLn("args[1]")
    secondArg <- readStrLn()
    _         <- putStrLn(s"$firstArg $secondArg")
  yield ()
~~~
