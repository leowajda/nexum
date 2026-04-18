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
title: ShortestSuperSequence.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/ShortestSuperSequence.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/ShortestSuperSequence.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/ShortestSuperSequence.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/ShortestSuperSequence.java
description: ShortestSuperSequence.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.*;
import java.util.stream.IntStream;

public class ShortestSuperSequence {

    private static List<Integer> shortestSuperSequence(int[] small, int[] big) {

        Map<Integer, Integer> counter = new HashMap<>(small.length);
        IntStream.of(small).forEach(num -> counter.put(num, 0));

        Queue<Integer> indices = new ArrayDeque<>();
        int numsCount = 0;

        List<Integer> shortestSuperSequence = List.of(-1, -1);
        int minDiff = Integer.MAX_VALUE;

        for (int rightPtr = 0; rightPtr < big.length; rightPtr++) {
            int rightNum = big[rightPtr];
            if (!counter.containsKey(rightNum)) continue;

            indices.add(rightPtr);
            int rightNumCount = counter.merge(rightNum, 1, Integer::sum);
            numsCount += rightNumCount == 1 ? 1 : 0;

            while (numsCount == small.length) {
                var leftPtr = indices.remove();
                int leftNum = big[leftPtr];
                int currDiff = rightPtr - leftPtr + 1;

                if (currDiff < minDiff) {
                    shortestSuperSequence = List.of(leftPtr, rightPtr);
                    minDiff = currDiff;
                }

                var leftNumCount = counter.merge(leftNum, -1, Integer::sum);
                if (leftNumCount == 0) numsCount--;
            }

        }

        return shortestSuperSequence;
    }

}
~~~
