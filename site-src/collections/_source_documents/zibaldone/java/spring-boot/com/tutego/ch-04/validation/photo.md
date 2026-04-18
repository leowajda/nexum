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
tree_path: src/main/java/com/tutego/ch_04/validation/Photo.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/validation/Photo.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/validation/Photo.java
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
- label: ch_04
  url: ''
- label: validation
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/validation/Photo.java
description: Photo.java notes
---

~~~java
package com.tutego.ch_04.validation;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public record Photo(

        @Min(1)
        Long id,

        @Min(1)
        long profile,

        @NotNull
        @Pattern(regexp = "[\\w_-]{1,200}")
        String name,

        boolean isProfilePhoto,

        @NotNull
        @Past
        LocalDateTime created
) {
}
~~~
