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
title: Photo.java
tree_path: src/main/java/com/tutego/ch_05/batchOperation/Photo.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_05/batchOperation/Photo.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_05/batchOperation/Photo.java
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
- label: ch_05
  url: ''
- label: batchOperation
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_05/batchOperation/Photo.java
description: Photo.java notes
---

~~~java
package com.tutego.ch_05.batchOperation;

import java.time.LocalDateTime;

public record Photo(long profile, String name, boolean isProfilePhoto, LocalDateTime created) {
}
~~~
