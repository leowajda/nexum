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
title: AsyncApplication.java
tree_path: src/main/java/com/tutego/ch_04/async/AsyncApplication.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/async/AsyncApplication.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/async/AsyncApplication.java
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
- label: async
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/async/AsyncApplication.java
description: AsyncApplication.java notes
---

~~~java
package com.tutego.ch_04.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync // backed by a thread-pool (configurable by AsyncConfigurer)
@SpringBootApplication(scanBasePackageClasses = AsyncModule.class)
public class AsyncApplication {

    private static final Logger logger = LoggerFactory.getLogger(AsyncApplication.class);

    public static void main(String... args) {
        SpringApplication.run(AsyncApplication.class, args);
    }

    @Bean
    public ApplicationRunner runAtStartTime(SleepAndDream sleepAndDream) {
        return args -> {
            sleepAndDream.sleepAsyncVoid();
            sleepAndDream.sleepAsyncString();
        };
    }

}
~~~
