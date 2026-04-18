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
title: Parens.java
tree_path: src/main/java/cracking_the_coding_interview/ch_08/Parens.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/Parens.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/Parens.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_08/Parens.java
description: Parens.java notes
---

~~~java
package cracking_the_coding_interview.ch_08;

import java.util.*;

public class Parens {

    private static List<String> parens(int n) {
        List<String> parens = new ArrayList<>();
         helper(n, n, parens, new ArrayDeque<>(n));
        return parens;
    }

    private static void helper(int openBrackets, int closedBrackets, List<String> parens, Deque<String> deque) {

        if (openBrackets == 0 && closedBrackets == 0) {
            parens.add(String.join("", deque));
            return;
        }

        if (openBrackets > 0) {
            deque.addLast("(");
            helper(openBrackets - 1, closedBrackets, parens, deque);
            deque.removeLast();
        }

        if (openBrackets < closedBrackets) {
            deque.addLast(")");
            helper(openBrackets, closedBrackets - 1, parens, deque);
            deque.removeLast();
        }

    }

}
~~~
