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
title: ApplicationEventListener.java
tree_path: src/main/java/com/tutego/ch_03/eventHandling/ApplicationEventListener.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_03/eventHandling/ApplicationEventListener.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_03/eventHandling/ApplicationEventListener.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_03/eventHandling/ApplicationEventListener.java
description: ApplicationEventListener.java notes
---

~~~java
package com.tutego.ch_03.eventHandling;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ExitCodeEvent;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ApplicationEventListener {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationEventListener.class);

    // https://github.com/spring-projects/spring-boot/issues/27945
    @EventListener({ ContextStartedEvent.class, ContextClosedEvent.class, ApplicationReadyEvent.class, ExitCodeEvent.class })
    public void onContextStartedEvent(ApplicationEvent event) {
        logger.info("ApplicationEvent: {} has been registered", event);
    }


}
~~~
