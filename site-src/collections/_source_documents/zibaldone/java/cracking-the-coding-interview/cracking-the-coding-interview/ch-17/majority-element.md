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
title: MajorityElement.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/MajorityElement.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/MajorityElement.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/MajorityElement.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/MajorityElement.java
description: MajorityElement.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.stream.IntStream;

public class MajorityElement {

    private static int majorityElement(int[] nums) {
        int majorityNum = count(nums);
        int count = (int) IntStream.of(nums).filter(num -> num == majorityNum).count();
        return count > (nums.length / 2) ? majorityNum : -1;
    }

    private static int count(int[] nums) {

        int majorityNum = 0, counter = 0;
        for (var num : nums) {
            if (counter == 0)       majorityNum = num;
            counter += (num == majorityNum) ? 1 : -1;
        }

        return majorityNum;
    }

}
~~~
