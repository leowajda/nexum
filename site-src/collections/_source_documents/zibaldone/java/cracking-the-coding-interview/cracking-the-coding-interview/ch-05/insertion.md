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
title: Insertion.java
tree_path: src/main/java/cracking_the_coding_interview/ch_05/Insertion.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/Insertion.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/Insertion.java
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
- label: ch_05
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_05/Insertion.java
description: Insertion.java notes
---

~~~java
package cracking_the_coding_interview.ch_05;

public class Insertion {

    public int insert(int m, int n, int j, int i) {

        int bottomMask = (~0 << (j + 1));
        int topMask    = ((1 << i) - 1);

        n &= (bottomMask | topMask);
        return n | (m << i);
    }

}
~~~
