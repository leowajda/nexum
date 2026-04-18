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
title: RotateMatrix.java
tree_path: src/main/java/cracking_the_coding_interview/ch_01/RotateMatrix.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/RotateMatrix.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/RotateMatrix.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_01/RotateMatrix.java
description: RotateMatrix.java notes
---

~~~java
package cracking_the_coding_interview.ch_01;

public class RotateMatrix {

    private static void rotateMatrix(int[][] matrix) {

        int n = matrix.length;

        for (int row = 0; row < n / 2; row++) {
            int first = row, last = n - 1 - row;
            for (int i = first; i < last; i++) {
                int offset = i - first;
                int top    = matrix[first][i];

                matrix[first][i]              = matrix[last - offset][first];
                matrix[last - offset][first]  = matrix[last][last - offset];
                matrix[last][last - offset]   = matrix[i][last];
                matrix[i][last]               = top;
            }
        }

    }

}
~~~
