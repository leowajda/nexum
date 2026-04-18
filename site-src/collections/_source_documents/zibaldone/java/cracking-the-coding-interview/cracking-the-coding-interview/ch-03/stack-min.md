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
title: StackMin.java
tree_path: src/main/java/cracking_the_coding_interview/ch_03/StackMin.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/StackMin.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/StackMin.java
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
- label: ch_03
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_03/StackMin.java
description: StackMin.java notes
---

~~~java
package cracking_the_coding_interview.ch_03;

public class StackMin {

    private IntStack stack;
    private IntStack minStack;

    public void push(int val) {
        stack.push(val);
        minStack.push(Math.min(val, min()));
    }

    public int min() {
        return minStack.peek();
    }

    public int peek() {
        return stack.peek();
    }

    public int pop() {
        int val = stack.pop();
        minStack.pop();
        return val;
    }

    public boolean isEmpty() {
        return stack.isEmpty();
    }

}
~~~
