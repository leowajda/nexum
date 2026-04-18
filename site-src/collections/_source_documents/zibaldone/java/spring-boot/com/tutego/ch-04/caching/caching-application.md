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
title: CachingApplication.java
tree_path: src/main/java/com/tutego/ch_04/caching/CachingApplication.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/caching/CachingApplication.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/caching/CachingApplication.java
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
- label: caching
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/caching/CachingApplication.java
description: CachingApplication.java notes
---

~~~java
package com.tutego.ch_04.caching;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

// defaults to java.util.concurrent.ConcurrentHashMap configurable through auto-configuration
@EnableCaching
@SpringBootApplication(scanBasePackageClasses = CachingModule.class)
public class CachingApplication {

    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final HotProfileToJsonConverter converter;

    public CachingApplication(HotProfileToJsonConverter converter) {
        // https://github.com/cglib/cglib
        // com.tutego.ch_04.caching.HotProfileToJsonConverter$$SpringCGLIB$$0
        logger.info("proxied bean: {}", converter.getClass().getName());
        this.converter = converter;
    }

    @Bean
    public ApplicationRunner runAtStartTime() {
        return args -> {
            var firstCall = converter.hotAsJson(Arrays.asList(1L, 2L, 3L));
            var secondCachedCall = converter.hotAsJson(Arrays.asList(1L, 2L, 3L));
        };
    }

    public static void main(String... args) {
        SpringApplication.run(CachingApplication.class, args);
    }

}
~~~
