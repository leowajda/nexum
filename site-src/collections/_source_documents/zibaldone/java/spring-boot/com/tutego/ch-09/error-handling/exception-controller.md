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
title: ExceptionController.java
tree_path: src/main/java/com/tutego/ch_09/errorHandling/ExceptionController.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/errorHandling/ExceptionController.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/errorHandling/ExceptionController.java
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
- label: ch_09
  url: ''
- label: errorHandling
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/errorHandling/ExceptionController.java
description: ExceptionController.java notes
---

~~~java
package com.tutego.ch_09.errorHandling;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExceptionController {

    @GetMapping
    public void exception() {
        throw new QuoteNotFoundException(); // 1. exception is mapped to an HTTP status code (not recommended)

        // 2. Spring data type for throwing exceptions at the @Controller level
        // throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such quote");
        // local / global exception handlers (see GlobalControllerAdvice)
    }


}
~~~
