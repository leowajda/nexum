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
title: LoginCredentials.java
tree_path: src/main/java/com/tutego/ch_06/advanced/LoginCredentials.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_06/advanced/LoginCredentials.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_06/advanced/LoginCredentials.java
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
- label: ch_06
  url: ''
- label: advanced
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_06/advanced/LoginCredentials.java
description: LoginCredentials.java notes
---

~~~java
package com.tutego.ch_06.advanced;

import jakarta.persistence.Embeddable;

// @Embeddable is always associated with a specific entity (like in the case of a composite key);
// the @Entity @Access policy cascades to @Embeddable types as well.
@Embeddable
public class LoginCredentials {
    private String email;
    private String password;

    @Override
    public String toString() {
        return "LoginCredentials{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
~~~
