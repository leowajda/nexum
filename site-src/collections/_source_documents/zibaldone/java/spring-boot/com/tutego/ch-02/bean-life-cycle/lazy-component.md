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
title: LazyComponent.java
tree_path: src/main/java/com/tutego/ch_02/beanLifeCycle/LazyComponent.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/beanLifeCycle/LazyComponent.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/beanLifeCycle/LazyComponent.java
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
- label: beanLifeCycle
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/beanLifeCycle/LazyComponent.java
description: LazyComponent.java notes
---

~~~java
package com.tutego.ch_02.beanLifeCycle;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

// if spring.main.lazy-initialization: true, @Lazy(true) will evaluate this component eagerly instead.
@Lazy(false)
@Component
public class LazyComponent {

    private static final Logger logger = LoggerFactory.getLogger(LazyComponent.class);

    public LazyComponent() {
        logger.info(LazyComponent.class.getName() + " is being initialized");
    }

    @PostConstruct
    public void postConstruct() {
        logger.info("postConstruct call for bean: " + LazyComponent.class.getName());
    }

    @PreDestroy
    public void preDestroy() {
        logger.info("preDestroy call for bean " + LazyComponent.class.getName());
    }

}
~~~
