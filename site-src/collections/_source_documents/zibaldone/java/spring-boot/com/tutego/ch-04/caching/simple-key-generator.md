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
title: SimpleKeyGenerator.java
tree_path: src/main/java/com/tutego/ch_04/caching/SimpleKeyGenerator.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/caching/SimpleKeyGenerator.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/caching/SimpleKeyGenerator.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/caching/SimpleKeyGenerator.java
description: SimpleKeyGenerator.java notes
---

~~~java
package com.tutego.ch_04.caching;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.cache.interceptor.SimpleKey;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Component
public class SimpleKeyGenerator implements KeyGenerator {

    @Override
    public Object generate(Object target, Method method, Object... params) {
        return generateKey(params);
    }

    private static Object generateKey(Object... params) {
        if (params.length == 0) {
            return SimpleKey.EMPTY;
        }

        if (params.length == 1) {
            Object param = params[0];
            if (param != null && !param.getClass().isArray()) {
                return param;
            }
        }

        return new SimpleKey(params);
    }

}
~~~
