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
title: SecureRandomPropertySourceFactory.java
tree_path: src/main/java/com/tutego/ch_03/externalConfiguration/SecureRandomPropertySourceFactory.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_03/externalConfiguration/SecureRandomPropertySourceFactory.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_03/externalConfiguration/SecureRandomPropertySourceFactory.java
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
- label: ch_03
  url: ''
- label: externalConfiguration
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_03/externalConfiguration/SecureRandomPropertySourceFactory.java
description: SecureRandomPropertySourceFactory.java notes
---

~~~java
package com.tutego.ch_03.externalConfiguration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;
import org.springframework.lang.Nullable;

import java.security.SecureRandom;

@Configuration
@org.springframework.context.annotation.PropertySource(value = "", factory = SecureRandomPropertySourceFactory.class)
class SecureRandomPropertySourceFactory implements PropertySourceFactory {

    private final SecureRandom random = new SecureRandom();

    @Override
    public PropertySource<?> createPropertySource(@Nullable String name, EncodedResource resource) {
        return new PropertySource<>("secure-random") {

            @Override
            public Object getProperty(String name) {
                return switch (name) {
                    case "secure-random.int" -> random.nextInt();
                    case "secure-random.long" -> random.nextLong();
                    default -> null;
                };
            }
        };

    }
}
~~~
