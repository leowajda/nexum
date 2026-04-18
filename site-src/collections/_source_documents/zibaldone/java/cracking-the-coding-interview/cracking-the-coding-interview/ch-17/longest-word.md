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
title: LongestWord.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/LongestWord.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/LongestWord.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/LongestWord.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/LongestWord.java
description: LongestWord.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.*;

public class LongestWord {

    private static String longestWord(List<String> words) {
        Set<String> dictionary    = new HashSet<>(words);
        Map<String, Integer> memo = new HashMap<>();

        words.forEach(word -> helper(word, memo, dictionary));

        String longestWord = "";
        int maxCounter = 0;

        for (var word : memo.entrySet())
            if (word.getValue() > maxCounter) {
                maxCounter = word.getValue();
                longestWord = word.getKey();
            }

        return longestWord;
    }

    private static int helper(String word, Map<String, Integer> memo, Set<String> dictionary) {
        if (memo.containsKey(word))
            return memo.get(word);

        int n = word.length();
        int counter = 0;

        for (int i = 1; i <= n; i++) {
            var a = word.substring(0, i);
            if (dictionary.contains(a)) {
                var b = i == n ? "" : word.substring(i);
                int bCounter = helper(b, memo, dictionary);
                if (b.isEmpty() || bCounter != 0) counter = Math.max(counter, 1 + bCounter);
            }
        }

        return memo.put(word, counter);
    }

}
~~~
