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
title: ProxyPattern.java
tree_path: src/main/java/com/tutego/ch_04/proxyPattern/ProxyPattern.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_04/proxyPattern/ProxyPattern.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_04/proxyPattern/ProxyPattern.java
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
- label: proxyPattern
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_04/proxyPattern/ProxyPattern.java
description: ProxyPattern.java notes
---

~~~java
package com.tutego.ch_04.proxyPattern;

public class ProxyPattern {

    private static class Subject {
        public String operation(String input) {
            return input;
        }
    }

    private static class Proxy extends Subject {
        private final Subject subject;

        public Proxy(Subject subject) {
            this.subject = subject;
        }

        @Override
        public String operation(String input) {
            // Preprocess the input
            // ....

            var result = subject.operation(input);

            // Postprocess the result
            // ...

            return result;
        }
    }

}
~~~
