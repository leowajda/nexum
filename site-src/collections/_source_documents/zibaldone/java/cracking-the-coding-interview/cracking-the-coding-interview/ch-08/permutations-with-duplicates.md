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
title: PermutationsWithDuplicates.java
tree_path: src/main/java/cracking_the_coding_interview/ch_08/PermutationsWithDuplicates.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/PermutationsWithDuplicates.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_08/PermutationsWithDuplicates.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_08/PermutationsWithDuplicates.java
description: PermutationsWithDuplicates.java notes
---

~~~java
package cracking_the_coding_interview.ch_08;

import java.util.*;

public class PermutationsWithDuplicates {

    private static List<String> permute(String s) {
        List<String> permutations = new ArrayList<>();
        int n = s.length();
        char[] characters = s.toCharArray();
        Arrays.sort(characters);
        helper(characters, new boolean[n], new ArrayDeque<>(), permutations);
        return permutations;
    }

    private static void helper(char[] characters, boolean[] visited, Deque<String> stack, List<String> permutations) {

        if (stack.size() == characters.length) {
            String permutation = String.join("", stack);
            permutations.add(permutation);
            return;
        }

        for (int i = 0; i < characters.length; i++) {
            if (visited[i])                                                     continue;
            if (i > 0 && characters[i] == characters[i - 1] && !visited[i - 1]) continue;

            String ch = String.valueOf(characters[i]);
            stack.push(ch);
            visited[i] = true;
            helper(characters, visited, stack, permutations);
            visited[i] = false;
            stack.pop();
        }
    }

}
~~~
