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
title: GeometryProperties.java
tree_path: src/main/java/com/tutego/ch_04/validation/GeometryProperties.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/validation/GeometryProperties.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/validation/GeometryProperties.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/validation/GeometryProperties.java
description: GeometryProperties.java notes
---

~~~java
package com.tutego.ch_04.validation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "geometry")
public record GeometryProperties(@NotNull Box box, @NotNull Circle circle) {
    public record Box(@Min(50) @Max(1000) int width, @Min(50) @Max(600) int height) { }
    public record Circle(@Min(10) @Max(1000) int radius) { /* conflicts with org.springframework.boot.context.properties.* */ }
}
~~~
