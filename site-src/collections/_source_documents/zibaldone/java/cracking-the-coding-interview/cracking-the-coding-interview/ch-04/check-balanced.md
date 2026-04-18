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
title: CheckBalanced.java
tree_path: src/main/java/cracking_the_coding_interview/ch_04/CheckBalanced.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/CheckBalanced.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/CheckBalanced.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_04/CheckBalanced.java
description: CheckBalanced.java notes
---

~~~java
package cracking_the_coding_interview.ch_04;

public class CheckBalanced {

    private static final int IMBALANCED_TREE_MARKER = Integer.MAX_VALUE;

    private static boolean isBalanced(TreeNode root) {
        return helper(root) != IMBALANCED_TREE_MARKER;
    }

    private static int helper(TreeNode root) {
        if (root == null)
            return 0;

        int leftDepth = helper(root.left);
        if (leftDepth == IMBALANCED_TREE_MARKER)  return leftDepth;

        int rightDepth = helper(root.right);
        if (rightDepth == IMBALANCED_TREE_MARKER) return rightDepth;

        int absDiff = Math.abs(leftDepth - rightDepth);
        return absDiff > 1 ? IMBALANCED_TREE_MARKER : Math.max(leftDepth, rightDepth) + 1;
    }

}
~~~
