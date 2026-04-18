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
title: ServletConfig.java
tree_path: src/main/java/com/tutego/ch_09/servlet/ServletConfig.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/servlet/ServletConfig.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/servlet/ServletConfig.java
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
- label: ch_09
  url: ''
- label: servlet
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/servlet/ServletConfig.java
description: ServletConfig.java notes
---

~~~java
package com.tutego.ch_09.servlet;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServletConfig {

    @Bean // registers a servlet that handles requests under /stat
    // ServletRegistrationBean registers the servlet directly with the servlet container, DispatcherServlet is not involved here
    public ServletRegistrationBean<StatisticServlet> statServlet() {
        return new ServletRegistrationBean<>(new StatisticServlet(), "/stat");
    }

}
~~~
