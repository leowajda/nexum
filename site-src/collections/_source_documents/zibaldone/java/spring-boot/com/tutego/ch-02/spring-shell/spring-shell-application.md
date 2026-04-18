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
title: SpringShellApplication.java
tree_path: src/main/java/com/tutego/ch_02/springShell/SpringShellApplication.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/springShell/SpringShellApplication.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/springShell/SpringShellApplication.java
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
- label: springShell
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/springShell/SpringShellApplication.java
description: SpringShellApplication.java notes
---

~~~java
package com.tutego.ch_02.springShell;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringShellApplication {

    private static final Logger logger = LoggerFactory.getLogger(SpringShellApplication.class);

    public static void main(String... args) {
        SpringApplication.run(com.tutego.ch_02.dependencyInjection.FsCommands.class, args);
        logger.info("Spring Shell blocks upon the application initialization, resumes upon closing..");
    }
}
~~~
