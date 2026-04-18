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
title: DivingBoard.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/DivingBoard.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/DivingBoard.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/DivingBoard.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/DivingBoard.java
description: DivingBoard.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

import java.util.HashSet;
import java.util.Set;

public class DivingBoard {

    private static Set<Integer> divingBoard(int shortPlank, int longPlank, int k) {

        Set<Integer> lengths = new HashSet<>(shortPlank);
        for (int numShorter = 0; numShorter <= k; numShorter++) {
            int numLonger = k - numShorter;
            int length    = (numShorter * shortPlank) + (numLonger + longPlank);
            lengths.add(length);
        }

        return lengths;
    }

}
~~~
