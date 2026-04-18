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
title: Binode.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/Binode.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/Binode.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/Binode.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/Binode.java
description: Binode.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

public class Binode {

    Binode left, right;
    int data;

    public Binode(Binode left, Binode right, int data) {
        this.left = left;
        this.right = right;
        this.data = data;
    }

    private static Binode prev;

    private static Binode convert(Binode root) {
        var dummy = new Binode(null, null, -1);
        prev = dummy;
        helper(root);
        return dummy.right;
    }

    private static void helper(Binode root) {
        if (root == null)
            return;

        helper(root.left);
        prev.right = root;
        prev       = root;
        root.left  = null;
        helper(root.right);
    }

}
~~~
