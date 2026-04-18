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
title: PatternMatching.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/PatternMatching.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/PatternMatching.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/PatternMatching.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/PatternMatching.java
description: PatternMatching.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

public class PatternMatching {

    private static boolean matches(String pattern, String value) {
        if (pattern.isEmpty()) return value.isEmpty();

        char mainCh     = pattern.charAt(0);
        char altCh      = mainCh == 'a' ? 'b' : 'a';
        int mainCount   = (int) pattern.chars().filter(ch -> (char) ch == mainCh).count();
        int altCount    = pattern.length() - mainCount;
        int altOffset   = pattern.indexOf(altCh);
        int mainMaxSize = value.length() / mainCount;

        for (int mainSize = 0; mainSize <= mainMaxSize; mainSize++) {
            int altMaxSize = value.length() - (mainSize * mainCount);
            var main = value.substring(0, mainSize);
            if (altMaxSize == 0 || altMaxSize % altCount == 0) {
                int altStart    = mainSize * altOffset;
                int altEnd      = altStart + (altMaxSize / altCount);
                var alt         = altMaxSize == 0 ? "" : value.substring(altStart, altEnd);
                var candidate   = asPattern(main, alt, pattern);
                if (candidate.equals(pattern)) return true;
            }
        }

        return false;
    }

    private static String asPattern(String main, String alt, String pattern) {
        StringBuilder sb = new StringBuilder();
        char mainCh = pattern.charAt(0);
        pattern.chars().forEach(ch -> sb.append((char) ch == mainCh ? main : alt));
        return sb.toString();
    }

}
~~~
