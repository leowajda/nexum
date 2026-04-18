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
title: Palindrome.java
tree_path: src/main/java/cracking_the_coding_interview/ch_02/Palindrome.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/Palindrome.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_02/Palindrome.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_02/Palindrome.java
description: Palindrome.java notes
---

~~~java
package cracking_the_coding_interview.ch_02;

public class Palindrome {

    private static boolean isPalindrome(Node node) {

        Node slow = node, fast = node;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
        }

        Node reversePtr = reverse(fast != null ? slow.next : slow);
        Node nodePtr    = node;

        while (reversePtr != null) {
            if (reversePtr.val != nodePtr.val)
                return false;

            reversePtr = reversePtr.next;
            nodePtr    = nodePtr.next;
        }

        return true;
    }

    private static Node reverse(Node node) {

        Node prev = null, next = null;
        while (node != null) {
            next = node.next;
            node.next = prev;
            prev = node;
            node = next;
        }

        return prev;
    }

}
~~~
