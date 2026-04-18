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
title: SpringDataJpaApplication.java
tree_path: src/main/java/com/tutego/ch_07/SpringDataJpaApplication.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_07/SpringDataJpaApplication.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_07/SpringDataJpaApplication.java
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
- label: ch_07
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_07/SpringDataJpaApplication.java
description: SpringDataJpaApplication.java notes
---

~~~java
package com.tutego.ch_07;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SpringDataJpaApplication {
    private final Logger log = LoggerFactory.getLogger(getClass());

    public SpringDataJpaApplication(ProfileRepository profiles) {
        log.info("Profile with id=1: {}", profiles.findById(1L));
        log.info("All profiles: {}", profiles.findAll());
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringDataJpaApplication.class, args);
    }
}
~~~
