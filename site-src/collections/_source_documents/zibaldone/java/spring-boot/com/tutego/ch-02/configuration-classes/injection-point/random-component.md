---
project_slug: zibaldone
project_title: Zibaldone
project_url: "/zibaldone/"
project_source_url: https://github.com/leowajda/zibaldone
language_slug: java
language_title: Java
language_url: "/zibaldone/java/"
module_slug: spring-boot
module_title: Spring Boot
title: RandomComponent.java
tree_path: src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/RandomComponent.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/RandomComponent.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/RandomComponent.java
language: java
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Java
  url: "/zibaldone/java/"
- label: Spring Boot
  url: "/zibaldone/java/spring-boot/"
- label: com
  url: ''
- label: tutego
  url: ''
- label: ch_02
  url: ''
- label: configurationClasses
  url: ''
- label: injectionPoint
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/RandomComponent.java
description: RandomComponent.java notes
---

~~~java
package com.tutego.ch_02.configurationClasses.injectionPoint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class RandomComponent {

    @Autowired
    @CryptographicallyStrong
    private Random random;

    @Autowired
    @CryptographicallyStrong
    public void setRandom(Random random) {
        this.random = random;
    }

}
~~~
