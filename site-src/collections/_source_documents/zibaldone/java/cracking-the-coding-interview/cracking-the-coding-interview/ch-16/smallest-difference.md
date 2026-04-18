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
title: SmallestDifference.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/SmallestDifference.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/SmallestDifference.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/SmallestDifference.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/SmallestDifference.java
description: SmallestDifference.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

import java.util.Arrays;

public class SmallestDifference {

    private static int findSmallestDifference(int[] a, int[] b) {

        int diff = Integer.MAX_VALUE;
        Arrays.sort(a);
        Arrays.sort(b);

        int aPtr = 0, bPtr = 0;
        while (aPtr < a.length && bPtr < b.length) {

            if (Math.abs(a[aPtr] - b[bPtr]) < diff)
                diff = Math.abs(a[aPtr] - b[bPtr]);

            if (a[aPtr] > b[bPtr]) bPtr++; else aPtr++;
        }

        return diff;
    }

}
~~~
