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
title: CircusTower.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/CircusTower.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/CircusTower.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/CircusTower.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/CircusTower.java
description: CircusTower.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.Arrays;

public class CircusTower {

    private static int circusTower(int[][] people) {
        Arrays.sort(people, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);
        int n = people.length;

        int[][] memo = new int[n + 1][n];
        Arrays.stream(memo).forEach(arr -> Arrays.fill(arr, -1));
        return helper(people, memo, -1, 0, 0);
    }

    private static int helper(int[][] people, int[][] memo, int prevIdx, int currIdx, int weightBound) {
        if (currIdx == people.length)
            return 0;

        if (memo[prevIdx + 1][currIdx] >= 0)
            return memo[prevIdx + 1][currIdx];

        int taken = 0;
        if (prevIdx < 0 || people[currIdx][1] > weightBound)
            taken = helper(people, memo, currIdx, currIdx + 1, people[currIdx][1]) + 1;

        int notTaken = helper(people, memo, prevIdx, currIdx + 1, weightBound);
        return memo[prevIdx + 1][currIdx] = Math.max(taken, notTaken);
    }

}
~~~
