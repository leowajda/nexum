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
title: ValidateBST.java
tree_path: src/main/java/cracking_the_coding_interview/ch_04/ValidateBST.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/ValidateBST.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/ValidateBST.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_04/ValidateBST.java
description: ValidateBST.java notes
---

~~~java
package cracking_the_coding_interview.ch_04;

public class ValidateBST {

    private static boolean isValidBST(TreeNode root) {
        return helper(Integer.MIN_VALUE, root, Integer.MAX_VALUE);
    }

    private static boolean helper(int min, TreeNode node, int max) {
        if (node == null) return true;
        boolean isNodeWithinBounds  = min <= node.val && node.val < max;
        boolean isLeftWithinBounds  = helper(min, node.left, node.val);
        boolean isRightWithinBounds = helper(node.val, node.right, max);
        return isNodeWithinBounds && isLeftWithinBounds && isRightWithinBounds;
    }

}
~~~
