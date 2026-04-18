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
title: ThreeInOne.java
tree_path: src/main/java/cracking_the_coding_interview/ch_03/ThreeInOne.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/ThreeInOne.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/ThreeInOne.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_03/ThreeInOne.java
description: ThreeInOne.java notes
---

~~~java
package cracking_the_coding_interview.ch_03;

import java.util.EmptyStackException;

public class ThreeInOne {

    private static final int NUM_STACKS = 3;

    private final int capacity;
    private final int[] values;
    private final int[] sizes;

    public ThreeInOne(int capacity) {
        this.capacity = capacity;
        this.sizes    = new int[NUM_STACKS];
        this.values   = new int[NUM_STACKS * capacity];
    }

    public void push(int stackNum, int value) {
        if (isFull(stackNum))
            throw new IllegalStateException(String.format("%d has reached capacity of %d", stackNum, capacity));

        sizes[stackNum]++;
        values[ithTop(stackNum)] = value;
    }

    public int pop(int stackNum) {
        if (isEmpty(stackNum))
            throw new EmptyStackException();

        int value = values[ithTop(stackNum)];
        values[ithTop(stackNum)] = 0;
        sizes[stackNum]--;
        return value;
    }

    public int peek(int stackNum) {
        if (isEmpty(stackNum))
            throw new EmptyStackException();

        return values[ithTop(stackNum)];
    }

    private boolean isEmpty(int stackNum) {
        return sizes[stackNum] == 0;
    }

    private boolean isFull(int stackNum) {
        return sizes[stackNum] == this.capacity;
    }

    private int ithTop(int stackNum) {
        int offset = stackNum * capacity;
        return offset - 1 + sizes[stackNum];
    }

}
~~~
