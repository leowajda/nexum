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
title: Conversion.java
tree_path: src/main/java/cracking_the_coding_interview/ch_05/Conversion.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/Conversion.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/Conversion.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_05/Conversion.java
description: Conversion.java notes
---

~~~java
package cracking_the_coding_interview.ch_05;

public class Conversion {

    private static int convert(int a, int b) {
        int counter = 0;
        for (int c = a ^ b; c != 0; c &= c - 1) counter++;
        return counter;
    }

}
~~~
