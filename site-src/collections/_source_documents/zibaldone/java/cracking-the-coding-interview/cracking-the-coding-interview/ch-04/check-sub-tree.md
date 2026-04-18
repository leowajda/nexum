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
title: CheckSubTree.java
tree_path: src/main/java/cracking_the_coding_interview/ch_04/CheckSubTree.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/CheckSubTree.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/CheckSubTree.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_04/CheckSubTree.java
description: CheckSubTree.java notes
---

~~~java
package cracking_the_coding_interview.ch_04;

public class CheckSubTree {

    private static boolean checkSubTree(TreeNode root, TreeNode subTree) {
        return isSame(root, subTree) || checkSubTree(root.left, subTree) || checkSubTree(root.right, subTree);
    }

    private static boolean isSame(TreeNode a, TreeNode b) {
        if (a == null || b == null)
            return a == b;
        return a.val == b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
    }

}
~~~
