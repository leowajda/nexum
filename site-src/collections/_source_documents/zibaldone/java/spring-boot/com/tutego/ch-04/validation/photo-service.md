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
title: PhotoService.java
tree_path: src/main/java/com/tutego/ch_04/validation/PhotoService.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/validation/PhotoService.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/validation/PhotoService.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/validation/PhotoService.java
description: PhotoService.java notes
---

~~~java
package com.tutego.ch_04.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class PhotoService {

    private static final Logger logger = LoggerFactory.getLogger(PhotoService.class);

    public void checkValidity(@Valid Photo photo) {
        logger.info("proxy has successfully validated photo: {}", photo);
    }

    public @NotEmpty String invalidOutput() {
        return "";
    }

}
~~~
