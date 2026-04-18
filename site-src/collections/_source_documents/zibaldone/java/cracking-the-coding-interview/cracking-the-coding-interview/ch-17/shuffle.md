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
title: Shuffle.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/Shuffle.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/Shuffle.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/Shuffle.java
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
- label: ch_17
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/Shuffle.java
description: Shuffle.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

public class Shuffle {

    private static int randomNum(int from, int to) {
        return from + (int) (Math.random() * (to - from + 1));
    }

    private static int[] shuffle(int[] cards) {

        for (int i = 0; i  < cards.length; i++) {
            int pos = randomNum(0, i);

            int tmp     = cards[pos];
            cards[pos]  = cards[i];
            cards[i]    = tmp;
        }

        return cards;
    }

}
~~~
