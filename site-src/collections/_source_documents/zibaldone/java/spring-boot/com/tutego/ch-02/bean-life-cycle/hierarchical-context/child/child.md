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
title: Child.java
tree_path: src/main/java/com/tutego/ch_02/beanLifeCycle/hierarchicalContext/child/Child.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/beanLifeCycle/hierarchicalContext/child/Child.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/beanLifeCycle/hierarchicalContext/child/Child.java
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
- label: hierarchicalContext
  url: ''
- label: child
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/beanLifeCycle/hierarchicalContext/child/Child.java
description: Child.java notes
---

~~~java
package com.tutego.ch_02.beanLifeCycle.hierarchicalContext.child;

import com.tutego.ch_02.beanLifeCycle.hierarchicalContext.parent.Parent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Child {

    @Autowired
    private Parent parent;

}
~~~
