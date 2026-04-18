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
title: Intersection.java
tree_path: src/main/java/cracking_the_coding_interview/ch_02/Intersection.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/Intersection.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/Intersection.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_02/Intersection.java
description: Intersection.java notes
---

~~~java
package cracking_the_coding_interview.ch_02;

public class Intersection {

    private static Node getIntersectionNode(Node a, Node b) {

        Node aPtr = a, bPtr = b;

        // both pointers eventually traverse the same amount of nodes A + B
        while (aPtr != bPtr) {
            aPtr = (aPtr == null) ? b : aPtr.next;
            bPtr = (bPtr == null) ? a : bPtr.next;
        }

        return aPtr;
    }

}
~~~
