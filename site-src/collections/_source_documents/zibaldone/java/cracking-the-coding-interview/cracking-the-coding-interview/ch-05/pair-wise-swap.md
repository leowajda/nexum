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
title: PairWiseSwap.java
tree_path: src/main/java/cracking_the_coding_interview/ch_05/PairWiseSwap.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/PairWiseSwap.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/PairWiseSwap.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_05/PairWiseSwap.java
description: PairWiseSwap.java notes
---

~~~java
package cracking_the_coding_interview.ch_05;

public class PairWiseSwap {

    private static final int ODD_BITS  = 0xAAAAAAAA;
    private static final int EVEN_BITS = 0x55555555;

    private static int pairWiseSwap(int num) {
        return ((num & ODD_BITS >>> 1) | (num & EVEN_BITS << 1));
    }

}
~~~
