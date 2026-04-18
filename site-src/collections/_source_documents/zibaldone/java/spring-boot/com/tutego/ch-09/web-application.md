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
title: WebApplication.java
tree_path: src/main/java/com/tutego/ch_09/WebApplication.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/WebApplication.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/WebApplication.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/WebApplication.java
description: WebApplication.java notes
---

~~~java
package com.tutego.ch_09;

import com.tutego.ch_07.SpringDataJpaModule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackageClasses = {
                WebModule.class,
                SpringDataJpaModule.class
        }
)
public class WebApplication {

    public static void main(String... args) {
        SpringApplication.run(WebApplication.class, args);
    }

}
~~~
