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
title: MinimalTree.java
tree_path: src/main/java/cracking_the_coding_interview/ch_04/MinimalTree.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/MinimalTree.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/MinimalTree.java
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
- label: ch_04
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_04/MinimalTree.java
description: MinimalTree.java notes
---

~~~java
package cracking_the_coding_interview.ch_04;

public class MinimalTree {

    private static TreeNode minimalTree(int[] array) {
        return helper(array, 0, array.length - 1);
    }

    private static TreeNode helper(int[] array, int start, int end) {
        if (start > end)
            return null;

        int middle = start + (end - start) / 2;
        var node   = new TreeNode(array[middle]);
        node.left  = helper(array, start, middle - 1);
        node.right = helper(array, middle + 1, end);
        return node;
    }

}
~~~
