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
title: CryptographicallyStrong.java
tree_path: src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/CryptographicallyStrong.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/CryptographicallyStrong.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/CryptographicallyStrong.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/configurationClasses/injectionPoint/CryptographicallyStrong.java
description: CryptographicallyStrong.java notes
---

~~~java
package com.tutego.ch_02.configurationClasses.injectionPoint;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface CryptographicallyStrong { }
~~~
