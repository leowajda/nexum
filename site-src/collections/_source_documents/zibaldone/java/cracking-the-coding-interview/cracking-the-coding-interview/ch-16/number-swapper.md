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
title: NumberSwapper.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/NumberSwapper.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/NumberSwapper.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/NumberSwapper.java
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
- label: ch_16
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/NumberSwapper.java
description: NumberSwapper.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

public class NumberSwapper {

    private static void swap(int a, int b) {
        a ^= b; // diff patch
        b ^= a; // apply patch to `b`
        a ^= b; // remove patch from `a`
    }

}
~~~
