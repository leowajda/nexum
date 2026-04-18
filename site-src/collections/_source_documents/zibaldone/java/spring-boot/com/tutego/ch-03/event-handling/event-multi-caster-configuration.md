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
title: EventMultiCasterConfiguration.java
tree_path: src/main/java/com/tutego/ch_03/eventHandling/EventMultiCasterConfiguration.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_03/eventHandling/EventMultiCasterConfiguration.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_03/eventHandling/EventMultiCasterConfiguration.java
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
- label: eventHandling
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_03/eventHandling/EventMultiCasterConfiguration.java
description: EventMultiCasterConfiguration.java notes
---

~~~java
package com.tutego.ch_03.eventHandling;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ApplicationEventMulticaster;
import org.springframework.context.event.SimpleApplicationEventMulticaster;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.scheduling.support.TaskUtils;


@Configuration
public class EventMultiCasterConfiguration {

    @Bean /* name of the bean actually matters!!! */
    public ApplicationEventMulticaster applicationEventMulticaster() {
        var multicaster = new SimpleApplicationEventMulticaster();
        // with this multicaster all event handlers are being called asynchronously by default, without using the @Async
        multicaster.setTaskExecutor(new SimpleAsyncTaskExecutor());
        multicaster.setErrorHandler(TaskUtils.LOG_AND_PROPAGATE_ERROR_HANDLER);
        return multicaster;
    }
}
~~~
