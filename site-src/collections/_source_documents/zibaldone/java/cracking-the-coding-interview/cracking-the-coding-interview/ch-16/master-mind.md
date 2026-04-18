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
title: MasterMind.java
tree_path: src/main/java/cracking_the_coding_interview/ch_16/MasterMind.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/MasterMind.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_16/MasterMind.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_16/MasterMind.java
description: MasterMind.java notes
---

~~~java
package cracking_the_coding_interview.ch_16;

import java.util.*;

public class MasterMind {

    private record Result(int hits, int pseudoHits) {}

    enum Ball { Red, Yellow, Green, Blue }

    private static Result masterMind(Ball[] solution, Ball[] guess) {
        if (solution == null || guess == null || solution.length != guess.length)
            return new Result(-1, -1);

        Map<Ball, Integer> frequency = new HashMap<>(solution.length);
        int hits = 0;

        for (int i = 0; i < solution.length; i++) {
            frequency.merge(solution[i], 1, Integer::sum);
            if (solution[i] == guess[i]) {
                frequency.merge(solution[i], -1, Integer::sum);
                hits++;
            }
        }

        int pseudoHits = 0;
        for (int i = 0; i < guess.length; i++)
            if (frequency.getOrDefault(guess[i], 0) > 0 && solution[i] != guess[i]) {
                frequency.merge(guess[i], -1, Integer::sum);
                pseudoHits++;
            }

        return new Result(hits, pseudoHits);
    }

}
~~~
