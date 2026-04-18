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
title: IsUnique.java
tree_path: src/main/java/cracking_the_coding_interview/ch_01/IsUnique.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/IsUnique.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_01/IsUnique.java
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
- label: ch_01
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_01/IsUnique.java
description: IsUnique.java notes
---

~~~java
package cracking_the_coding_interview.ch_01;

public class IsUnique {

    private static boolean hasAllUniqueCharacters(String s) {

        int bitMask = 0b0;
        // assumes ASCII in range 'a' - 'z'
        for (int i = 0; i < s.length(); i++) {
            int val = s.charAt(i) - 'a';
            int marker = (1 << val);
            if ((bitMask & marker) != 0)
                return false;
            bitMask |= marker;
        }

        return true;
    }

}
~~~
