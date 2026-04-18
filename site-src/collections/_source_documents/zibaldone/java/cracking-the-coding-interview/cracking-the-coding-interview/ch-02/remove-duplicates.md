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
title: RemoveDuplicates.java
tree_path: src/main/java/cracking_the_coding_interview/ch_02/RemoveDuplicates.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/RemoveDuplicates.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/RemoveDuplicates.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_02/RemoveDuplicates.java
description: RemoveDuplicates.java notes
---

~~~java
package cracking_the_coding_interview.ch_02;

import java.util.HashSet;
import java.util.Set;

public class RemoveDuplicates {

    private static void removeDuplicates(Node head) {
        Set<Integer> seen = new HashSet<>();
        Node prev = head;

        while (head != null) {
            if (seen.add(head.val)) prev = head;
            else                    prev.next = head.next;
            head = head.next;
        }
    }

}
~~~
