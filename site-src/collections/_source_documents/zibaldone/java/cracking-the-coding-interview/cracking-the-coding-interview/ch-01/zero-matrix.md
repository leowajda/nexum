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
title: ZeroMatrix.java
tree_path: src/main/java/cracking_the_coding_interview/ch_01/ZeroMatrix.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/ZeroMatrix.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/ZeroMatrix.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_01/ZeroMatrix.java
description: ZeroMatrix.java notes
---

~~~java
package cracking_the_coding_interview.ch_01;

import java.util.Arrays;

public class ZeroMatrix {

    private static void zeroMatrix(int[][] matrix) {

        boolean isFirstRowZero = false, isFirstColZero = false;
        int rows = matrix.length, cols = matrix[0].length;

        for (int row = 0; row < rows; row++)
            for (int col = 0; col < cols; col++)
                if (matrix[row][col] == 0) {
                    if (row == 0) isFirstRowZero = true;
                    if (col == 0) isFirstColZero = true;

                    matrix[row][0] = 0;
                    matrix[0][col] = 0;
                }

        for (int row = 1; row < rows; row++)
            if (matrix[row][0] == 0)
                Arrays.fill(matrix[row], 0);

        for (int col = 1; col < cols; col++)
            if (matrix[0][col] == 0)
                for (int row = 1; row < rows; row++) matrix[row][col] = 0;

        if (isFirstRowZero) Arrays.fill(matrix[0], 0);
        if (isFirstColZero) for (int row = 1; row < rows; row++) matrix[row][0] = 0;
    }

}
~~~
