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
title: TripleStep.java
tree_path: src/main/java/cracking_the_coding_interview/ch_08/TripleStep.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/TripleStep.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/TripleStep.java
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
- label: ch_08
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_08/TripleStep.java
description: TripleStep.java notes
---

~~~java
package cracking_the_coding_interview.ch_08;

public class TripleStep {

    private static int tripleStep(int n) {
        int a = 1, b = 2, c = 4;
        if (n <= 3) return n == 3 ? c : n;

        for (int i = 4; i <= n; i++) {
            int d = a + b + c;
            a = b;
            b = c;
            c = d;
        }

        return c;
    }

}
~~~
