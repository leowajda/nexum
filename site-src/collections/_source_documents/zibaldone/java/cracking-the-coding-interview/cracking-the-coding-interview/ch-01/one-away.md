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
title: OneAway.java
tree_path: src/main/java/cracking_the_coding_interview/ch_01/OneAway.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/OneAway.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/OneAway.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_01/OneAway.java
description: OneAway.java notes
---

~~~java
package cracking_the_coding_interview.ch_01;

public class OneAway {

    private static boolean isOneAway(String a, String b) {
        if (Math.abs(a.length() - b.length()) >= 2)
            return false;

        String left  = (a.length() <= b.length()) ? a : b;
        String right = (a.length() <= b.length()) ? b : a;

        boolean isTwoAway = false;
        int leftPtr = 0, rightPtr = 0;

        while (leftPtr < left.length() && rightPtr < right.length()) {
            char leftChar = left.charAt(leftPtr), rightChar = right.charAt(rightPtr);

            if (leftChar == rightChar) {
                leftPtr++;
                rightPtr++;
                continue;
            }

            if (isTwoAway) {
                return false;
            }

            if (left.length() == right.length()) {
                leftPtr++;
            }

            isTwoAway = true;
            rightPtr++;
        }

        return true;
    }

}
~~~
