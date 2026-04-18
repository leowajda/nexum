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
title: AsyncConfig.java
tree_path: src/main/java/com/tutego/ch_04/async/AsyncConfig.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/async/AsyncConfig.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/async/AsyncConfig.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/async/AsyncConfig.java
description: AsyncConfig.java notes
---

~~~java
package com.tutego.ch_04.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.stream.IntStream;

// TaskExecutor is the Spring equivalent of the Executor from the std (it predates it and is configurable at runtime)
// public interface TaskExecutor extends Executor
@Configuration
class AsyncConfig implements AsyncConfigurer {
    private final Logger log = LoggerFactory.getLogger(getClass());

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            log.info("Exception: {}", throwable.getMessage());
            log.info("Method: {}", method);
            IntStream.range(0, params.length).forEach(index -> log.info("Parameter {}: {}", index, params[index]));
        };
    }
}
~~~
