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
title: SleepAndDream.java
tree_path: src/main/java/com/tutego/ch_04/async/SleepAndDream.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/async/SleepAndDream.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/async/SleepAndDream.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/async/SleepAndDream.java
description: SleepAndDream.java notes
---

~~~java
package com.tutego.ch_04.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Component
public class SleepAndDream {

    private static final Logger logger = LoggerFactory.getLogger(SleepAndDream.class);

    @Async // the proxy 'hides' the side effect of CompletableFuture<Void> but makes it much harder to trace
    public void sleepAsyncVoid() throws Exception {
        logger.info("Going to sleep: SNNNNOOORRRREEEEE");
        TimeUnit.SECONDS.sleep(1);
        logger.info("Woke up");
    }

    @Async
    public CompletableFuture<String> sleepAsyncString() throws Exception {
        logger.info("Starting to dream");
        TimeUnit.SECONDS.sleep(1);
        logger.info("Finished the dream");
        return CompletableFuture.completedFuture("about unicorns");
    }
}
~~~
