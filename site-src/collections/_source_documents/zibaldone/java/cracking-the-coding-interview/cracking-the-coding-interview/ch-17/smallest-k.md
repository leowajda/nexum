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
title: SmallestK.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/SmallestK.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/SmallestK.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/SmallestK.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/SmallestK.java
description: SmallestK.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

public class SmallestK {

    private static List<Integer> smallestK(List<Integer> nums, int k) {

        Queue<Integer> queue = new PriorityQueue<>(Comparator.reverseOrder());

        for (var num : nums)
            if (queue.size() < k) queue.add(num);
            else                  queue.add(Math.min(num, queue.remove()));

        return queue.stream().toList();
    }

}
~~~
