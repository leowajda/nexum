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
title: WordDistance.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/WordDistance.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/WordDistance.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/WordDistance.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/WordDistance.java
description: WordDistance.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class WordDistance {

    private final File file;
    private final Map<String, List<Integer>> map;

    public WordDistance(File file) throws FileNotFoundException {
        this.file = file;
        this.map  = new HashMap<>();
        int counter = 0;

        try (var in = new Scanner(file)) {
            var word = in.next(" ");
            var pointers = map.computeIfAbsent(word, any -> new ArrayList<>());
            pointers.add(counter++);
        }
    }

    public WordDistance(String fileName) throws FileNotFoundException {
        this(new File(fileName));
    }

    public int shortestDistance(String a, String b) {
        if (!map.containsKey(a) || !map.containsKey(b))
            return -1;

        var aPointers = map.get(a);
        var bPointers = map.get(b);

        int minDistance = Integer.MAX_VALUE;
        int aPtr = 0, bPtr = bPointers.size() - 1;

        while (aPtr < aPointers.size() && bPtr >= 0) {
            int aVal = aPointers.get(aPtr);
            int bVal = bPointers.get(bPtr);

            int distance = Math.abs(aVal - bVal);
            if (distance < minDistance) {
                minDistance = distance;
                bPtr--;
            } else aPtr++;

        }

        return minDistance;
    }

}
~~~
