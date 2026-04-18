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
title: MissingNumber.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/MissingNumber.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/MissingNumber.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/MissingNumber.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/MissingNumber.java
description: MissingNumber.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.Arrays;

public class MissingNumber {

    // book author presents an over-engineered solution because doesn't want to admit that integer size is in fact constant and not log(n).
    // also, the bit indexing requirement is complete bs...
    private static int missingNumber(int[] nums) {
        int sum = Arrays.stream(nums).sum();
        int n   = nums.length;
        return (n * (n + 1) / 2) - sum;
    }
}
~~~
