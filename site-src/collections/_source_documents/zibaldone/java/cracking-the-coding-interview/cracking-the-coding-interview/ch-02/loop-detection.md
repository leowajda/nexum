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
title: LoopDetection.java
tree_path: src/main/java/cracking_the_coding_interview/ch_02/LoopDetection.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/LoopDetection.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/LoopDetection.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_02/LoopDetection.java
description: LoopDetection.java notes
---

~~~java
package cracking_the_coding_interview.ch_02;

public class LoopDetection {

    private static Node detectLoop(Node node) {

        Node slow = node, fast = node;

        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;

            if (fast == slow) break;
        }

        if (fast == null || fast.next == null)
            return null;

        slow = node;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }

        return slow;
    }

}
~~~
