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
title: PalindromePermutation.java
tree_path: src/main/java/cracking_the_coding_interview/ch_01/PalindromePermutation.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/PalindromePermutation.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/PalindromePermutation.java
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
- label: ch_01
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_01/PalindromePermutation.java
description: PalindromePermutation.java notes
---

~~~java
package cracking_the_coding_interview.ch_01;

public class PalindromePermutation {

    private static boolean isPalindromePermutation(String s) {

        int bitMask = 0b0;
        // assumes ASCII in range 'a' - 'z'
        for (int i = 0; i < s.length(); i++) {
            int val = s.charAt(i) - 'a';
            bitMask ^= (1 << val);
        }

        return bitMask == 0 || ((bitMask & (bitMask - 1)) == 0);
    }

}
~~~
