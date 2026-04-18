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
title: Partition.java
tree_path: src/main/java/cracking_the_coding_interview/ch_02/Partition.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/Partition.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/Partition.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_02/Partition.java
description: Partition.java notes
---

~~~java
package cracking_the_coding_interview.ch_02;

public class Partition {

    private static Node partition(Node node, int value) {

        Node headLow = null, currLow = null;
        Node headTop = null, currTop = null;

        while (node != null) {
            Node currNode = node;
            node = node.next;
            currNode.next = null;

            if (currNode.val < value) {

                if (headLow == null) {
                    headLow = currNode;
                    currLow = headLow;
                    continue;
                }

                currLow.next = currNode;
                currLow = currLow.next;
            }
            else {

                if (headTop == null) {
                    headTop = currNode;
                    currTop = headTop;
                    continue;
                }

                currTop.next = currNode;
                currTop = currTop.next;
            }

        }

        if (headTop == null) return headLow;
        if (headLow  == null) return headTop;
        currLow.next = headTop;

        return headLow;
    }

}
~~~
