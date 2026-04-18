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
title: SortStack.java
tree_path: src/main/java/cracking_the_coding_interview/ch_03/SortStack.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/SortStack.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/SortStack.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_03/SortStack.java
description: SortStack.java notes
---

~~~java
package cracking_the_coding_interview.ch_03;

public class SortStack {

    private final IntStack stack, placeholder;

    public SortStack() {
        this.stack       = new IntStack();
        this.placeholder = new IntStack();
    }

    public void push(int value) {

        while (!stack.isEmpty() && value > stack.peek())
            placeholder.push(stack.pop());

        stack.push(value);

        while (!placeholder.isEmpty())
            stack.push(placeholder.pop());

    }

    public int pop() {
        return stack.pop();
    }

    public int peek() {
        return stack.peek();
    }

    public boolean isEmpty() {
        return stack.isEmpty();
    }

    @Override
    public String toString() {
        return stack.toString();
    }
}
~~~
