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
title: KthMultiple.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/KthMultiple.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/KthMultiple.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/KthMultiple.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/KthMultiple.java
description: KthMultiple.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.stream.LongStream;

public class KthMultiple {

    public int kthMultiple(int k) {

        int[] multipliers   = { 3, 5, 7 };
        int[] pointers      = { 0, 0, 0 };
        long[] uglyNums     = new long[k];
        long[] candidates   = new long[3];

        uglyNums[0] = 1;
        for (int i = 1; i < k; i++) {

            for (int j = 0; j < candidates.length; j++)
                candidates[j] = uglyNums[pointers[j]] * multipliers[j];

            uglyNums[i] = LongStream.of(candidates).min().orElseThrow();

            for (int j = 0; j < candidates.length; j++)
                if (candidates[j] == uglyNums[i])
                    pointers[j]++;
        }

        return (int) uglyNums[k - 1];
    }

}
~~~
