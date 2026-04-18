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
title: PairsWithSum.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/PairsWithSum.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/PairsWithSum.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/PairsWithSum.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/PairsWithSum.java
description: PairsWithSum.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PairsWithSum {

    // problem statement not very clear how duplicate pairs should be handled
    private static List<List<Integer>> pairsWithSum(int[] nums, int target) {
        List<List<Integer>> pairs   = new ArrayList<>();
        Set<Integer> visited        = new HashSet<>();

        for (var num : nums) {
            int diff = target - num;
            if (visited.contains(diff)) pairs.add(List.of(num, diff));
            visited.add(num);
        }

        return pairs;
    }

}
~~~
