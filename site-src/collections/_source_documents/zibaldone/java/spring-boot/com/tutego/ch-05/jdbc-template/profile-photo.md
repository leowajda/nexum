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
title: ProfilePhoto.java
tree_path: src/main/java/com/tutego/ch_05/jdbcTemplate/ProfilePhoto.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_05/jdbcTemplate/ProfilePhoto.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_05/jdbcTemplate/ProfilePhoto.java
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
- label: ch_05
  url: ''
- label: jdbcTemplate
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_05/jdbcTemplate/ProfilePhoto.java
description: ProfilePhoto.java notes
---

~~~java
package com.tutego.ch_05.jdbcTemplate;

// JavaBean: reusable Java class with a no-arg constructor and getter/setter properties following standard naming conventions.
public class ProfilePhoto {
    private long id;
    private String imageName;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    @Override
    public String toString() {
        return "ProfilePhoto{" +
                "id=" + id +
                ", imageName='" + imageName + '\'' +
                '}';
    }
}
~~~
