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
title: FirstCommonAncestor.java
tree_path: src/main/java/cracking_the_coding_interview/ch_04/FirstCommonAncestor.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/FirstCommonAncestor.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_04/FirstCommonAncestor.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_04/FirstCommonAncestor.java
description: FirstCommonAncestor.java notes
---

~~~java
package cracking_the_coding_interview.ch_04;

public class FirstCommonAncestor {

    private static TreeNode firstCommonAncestor(TreeNode root, TreeNode a, TreeNode b) {
        if (root == null || root == a || root == b)
            return root;

        var leftAncestor  = firstCommonAncestor(root.left, a, b);
        var rightAncestor = firstCommonAncestor(root.right, a, b);

        if (leftAncestor != null && rightAncestor != null) return root;
        return leftAncestor != null ? leftAncestor : rightAncestor;
    }

}
~~~
