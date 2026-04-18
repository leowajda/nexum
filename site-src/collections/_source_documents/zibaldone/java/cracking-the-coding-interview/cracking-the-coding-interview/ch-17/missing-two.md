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
title: MissingTwo.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/MissingTwo.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/MissingTwo.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/MissingTwo.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/MissingTwo.java
description: MissingTwo.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.stream.IntStream;

public class MissingTwo {

    private static int[] missingTwo(int[] nums) {

        int targetN         = nums.length + 2;
        int actualTargetSum = IntStream.of(nums).sum();
        int targetDiff      = nSum(targetN) - actualTargetSum;

        int offset          = targetDiff / 2;
        int actualOffsetSum = IntStream.of(nums).filter(num -> num <= offset).sum();
        int offsetDiff      = nSum(offset) - actualOffsetSum;

        return new int[] { offsetDiff, targetDiff - offsetDiff };
    }

    private static int nSum(int n) {
        return n * (n + 1) / 2;
    }

}
~~~
