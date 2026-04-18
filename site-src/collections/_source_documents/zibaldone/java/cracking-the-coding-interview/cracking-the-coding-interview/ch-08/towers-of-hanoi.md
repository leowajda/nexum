---
project_slug: zibaldone
project_title: Zibaldone
project_url: "/zibaldone/"
project_source_url: https://github.com/leowajda/zibaldone
language_slug: java
language_title: Java
language_url: "/zibaldone/java/"
module_slug: cracking-the-coding-interview
module_title: Cracking the Coding Interview
title: TowersOfHanoi.java
tree_path: src/main/java/cracking_the_coding_interview/ch_08/TowersOfHanoi.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/TowersOfHanoi.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/TowersOfHanoi.java
language: java
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Java
  url: "/zibaldone/java/"
- label: Cracking the Coding Interview
  url: "/zibaldone/java/cracking-the-coding-interview/"
- label: cracking_the_coding_interview
  url: ''
- label: ch_08
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_08/TowersOfHanoi.java
description: TowersOfHanoi.java notes
---

~~~java
package cracking_the_coding_interview.ch_08;

import java.util.Deque;

public class TowersOfHanoi {

    private static void move(int n, Deque<Integer> origin, Deque<Integer> destination, Deque<Integer> buffer) {
        if (n <= 0) return;
        move(n - 1, origin, buffer, destination);
        destination.push(origin.pop());
        move(n - 1, buffer, destination, origin);
    }

}
~~~
