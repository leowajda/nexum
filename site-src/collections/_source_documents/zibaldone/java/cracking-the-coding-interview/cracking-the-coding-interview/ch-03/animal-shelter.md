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
title: AnimalShelter.java
tree_path: src/main/java/cracking_the_coding_interview/ch_03/AnimalShelter.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/AnimalShelter.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_03/AnimalShelter.java
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
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_03/AnimalShelter.java
description: AnimalShelter.java notes
---

~~~java
package cracking_the_coding_interview.ch_03;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

public class AnimalShelter {

    private sealed abstract class Animal permits Dog, Cat {
         public Instant arrivalTime;

         public final void setArrivalTime() {
            this.arrivalTime = Instant.now();
        }
    }

    private final class Dog extends Animal { }
    private final class Cat extends Animal { }

    private final List<Dog> dogQueue;
    private final List<Cat> catQueue;

    public AnimalShelter() {
        this.dogQueue = new LinkedList<>();
        this.catQueue = new LinkedList<>();
    }

    public void enqueue(Animal animal) {
        // mutability is necessary if the arrival time differs from the initialization time
        animal.setArrivalTime();

        switch (animal) {
            case Cat cat -> catQueue.addLast(cat);
            case Dog dog -> dogQueue.addLast(dog);
            default      -> throw new IllegalStateException("Unexpected value: " + animal);
        }
    }

    public Animal dequeueAny() {

        if (dogQueue.isEmpty() && catQueue.isEmpty()) throw new NoSuchElementException();
        if (dogQueue.isEmpty())                       return dequeueCat();
        if (catQueue.isEmpty())                       return dequeueDog();

        Animal oldestDog = dogQueue.getFirst(), oldestCat = catQueue.getFirst();
        return oldestDog.arrivalTime.isBefore(oldestCat.arrivalTime) ? dequeueDog() : dequeueCat();
    }

    public Dog dequeueDog() {
        return dogQueue.removeFirst();
    }

    public Cat dequeueCat() {
        return catQueue.removeFirst();
    }
}
~~~
