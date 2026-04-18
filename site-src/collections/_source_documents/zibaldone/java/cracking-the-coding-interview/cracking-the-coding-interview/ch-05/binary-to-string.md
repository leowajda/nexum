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
title: BinaryToString.java
tree_path: src/main/java/cracking_the_coding_interview/ch_05/BinaryToString.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/BinaryToString.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_05/BinaryToString.java
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
- label: ch_05
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_05/BinaryToString.java
description: BinaryToString.java notes
---

~~~java
package cracking_the_coding_interview.ch_05;

public class BinaryToString {

    private static String binaryToString(double num) {
        if (num <= 0 || num >= 1)
            return "ERROR";

        StringBuilder sb = new StringBuilder();
        double offset = 0.5;

        while (num > 0) {

            if (sb.length() >= 32)
                return "ERROR";

            if (num >= offset) {
                num -= offset;
                sb.append(1);
            } else
                sb.append(0);

            offset /= 2;
        }

        return sb.toString();
    }

}
~~~
