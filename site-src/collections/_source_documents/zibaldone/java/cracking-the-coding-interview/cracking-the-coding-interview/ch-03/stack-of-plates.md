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
title: StackOfPlates.java
tree_path: src/main/java/cracking_the_coding_interview/ch_03/StackOfPlates.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/StackOfPlates.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/StackOfPlates.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_03/StackOfPlates.java
description: StackOfPlates.java notes
---

~~~java
package cracking_the_coding_interview.ch_03;

import java.util.*;

public class StackOfPlates {

    private final List<IntStack> stacks;
    private final int stackCapacity;

     public StackOfPlates(int stackCapacity) {
         this.stacks        = new ArrayList<>();
         this.stackCapacity = stackCapacity;
     }

     public void push(int value) {
         var lastStack = getLastStack();

         if (lastStack != null && lastStack.getSize() < stackCapacity) {
             lastStack.push(value);
             return;
         }

         lastStack = new IntStack();
         lastStack.push(value);
         stacks.addLast(lastStack);
     }

    // popAt(int idx) requires Node to reference both the next and prev node.
    public int pop() {
         var lastStack = getLastStack();

         if (lastStack == null)
             throw new EmptyStackException();

         int value = lastStack.pop();

         if (lastStack.isEmpty())
             stacks.removeLast();

         return value;
     }

     private IntStack getLastStack() {
         if (stacks.isEmpty()) return null;
         return stacks.getLast();
     }

}
~~~
