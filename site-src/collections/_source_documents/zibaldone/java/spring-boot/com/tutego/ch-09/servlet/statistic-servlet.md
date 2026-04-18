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
title: StatisticServlet.java
tree_path: src/main/java/com/tutego/ch_09/servlet/StatisticServlet.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/servlet/StatisticServlet.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/servlet/StatisticServlet.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/servlet/StatisticServlet.java
description: StatisticServlet.java notes
---

~~~java
package com.tutego.ch_09.servlet;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

// can also be registered via @WebServlet + @ServletComponentScan
public class StatisticServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.getWriter().write("123456");
    }

}
~~~
