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
title: ReturnKthToLast.java
tree_path: src/main/java/cracking_the_coding_interview/ch_02/ReturnKthToLast.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/ReturnKthToLast.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/ReturnKthToLast.java
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
- label: ch_02
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_02/ReturnKthToLast.java
description: ReturnKthToLast.java notes
---

~~~java
package cracking_the_coding_interview.ch_02;

public class ReturnKthToLast {

    private static Node kthToLast(Node head, int k) {
        Node slow = head, fast = head;

        for (int i = 0; i < k; i++)
            if (fast == null) return null;
            else              fast = fast.next;

        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        return slow;
    }

}
~~~
