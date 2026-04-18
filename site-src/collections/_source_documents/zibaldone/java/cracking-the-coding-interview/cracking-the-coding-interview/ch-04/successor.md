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
title: Successor.java
tree_path: src/main/java/cracking_the_coding_interview/ch_04/Successor.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/Successor.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/Successor.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_04/Successor.java
description: Successor.java notes
---

~~~java
package cracking_the_coding_interview.ch_04;

public class Successor {

    private static TreeNode inOrderSuccessor(TreeNode node) {
        if (node == null) return null;

        if (node.right != null)
            return bstMinimum(node.right);

        TreeNode parent = node.parent, child = node;
        while (parent != null && child == parent.right) {
            child  = parent;
            parent = parent.parent;
        }

        return parent;
    }

    private static TreeNode bstMinimum(TreeNode root) {
        TreeNode node = root;
        while (node.left != null)
            node = node.left;
        return node;
    }

}
~~~
