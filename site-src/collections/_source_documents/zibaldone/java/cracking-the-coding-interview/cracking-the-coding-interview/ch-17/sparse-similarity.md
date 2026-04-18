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
title: SparseSimilarity.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/SparseSimilarity.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/SparseSimilarity.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/SparseSimilarity.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/SparseSimilarity.java
description: SparseSimilarity.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SparseSimilarity {

    private static List<Double> sparseSimilarity(int[][] docs) {

        Map<Integer, List<Integer>> numsToDocs = new HashMap<>();
        for (int docId = 0; docId < docs.length; docId++)
            for (var num : docs[docId])
                numsToDocs.computeIfAbsent(num, any -> new ArrayList<>()).add(docId);

        Map<String, Integer> counter = new HashMap<>();
        for (var docIds : numsToDocs.values()) {
            int n = docIds.size();
            for (int i = 0; i < n; i++)
                for (int j = i + 1; j < n; j++) {
                    int docA = docIds.get(i);
                    int docB = docIds.get(j);
                    var key  = docA + "," + docB;
                    counter.merge(key, 1, Integer::sum);
                }
        }

        List<Double> sparseSimilarity = new ArrayList<>();
        for (var entry : counter.entrySet()) {
            var docIds = entry.getKey().split(",");
            var docA   = Integer.parseInt(docIds[0]);
            var docB   = Integer.parseInt(docIds[1]);

            int intersectionCount   = entry.getValue();
            int unionCount          = docs[docA].length + docs[docB].length - intersectionCount;
            double similarity       = (double) intersectionCount / unionCount;
            sparseSimilarity.add(similarity);
        }

        return sparseSimilarity;
    }

}
~~~
