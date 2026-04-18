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
title: Operations.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/Operations.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/Operations.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/Operations.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/Operations.java
description: Operations.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

public class Operations {

    private static int negate(int num) {

        int negativeNum = 0;
        int isPositive  = num > 0 ? -1 : 1;
        int offset      = isPositive;

        while (num != 0) {
            boolean isOverflowDetected = (num + offset > 0) != (num > 0);
            if (num + offset != 0 && isOverflowDetected)
                offset = isPositive;

            negativeNum += offset;
            num         += offset;
            offset      += offset;
        }

        return negativeNum;
    }

    private static int multiply(int a, int b) {
        int absoluteA = abs(a);
        int absoluteB = abs(b);

        if (absoluteB > absoluteA) return multiply(b, a);
        int sum = 0;
        for (int i = 0; i < absoluteB; i++) sum += absoluteA;

        return (a > 0 && b > 0) || (a < 0 && b < 0) ? sum : negate(sum);
    }

    private static int divide(int a, int b) {
        int absoluteA = abs(a);
        int absoluteB = abs(b);

        int acc = 0, counter = 0;
        while (acc + absoluteB <= absoluteA) {
            counter++;
            acc += absoluteB;
        }

        return (a > 0 && b > 0) || (a < 0 && b < 0) ? counter : negate(counter);
    }

    private static int abs(int num) {
        return num < 0 ? negate(num) : num;
    }

}
~~~
