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
title: SchedulingApplication.java
tree_path: src/main/java/com/tutego/ch_03/scheduling/SchedulingApplication.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_03/scheduling/SchedulingApplication.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_03/scheduling/SchedulingApplication.java
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
- label: scheduling
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_03/scheduling/SchedulingApplication.java
description: SchedulingApplication.java notes
---

~~~java
package com.tutego.ch_03.scheduling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling // configures a ScheduledAnnotationBeanPostProcessor, applicable on @Configuration beans
@SpringBootApplication(scanBasePackageClasses = SchedulingModule.class)
public class SchedulingApplication {

    // https://docs.spring.io/spring-boot/reference/io/quartz.html
    public static void main(String... args) {
        SpringApplication.run(SchedulingApplication.class, args);
    }
}
~~~
