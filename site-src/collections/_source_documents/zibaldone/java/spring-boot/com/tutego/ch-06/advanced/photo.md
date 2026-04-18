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
title: Photo.java
tree_path: src/main/java/com/tutego/ch_06/advanced/Photo.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_06/advanced/Photo.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_06/advanced/Photo.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_06/advanced/Photo.java
description: Photo.java notes
---

~~~java
package com.tutego.ch_06.advanced;

import com.tutego.ch_06.read.Profile;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Access(AccessType.FIELD)
public class Photo extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name = "profile_fk")
    private Profile profile;

    private String name;

    @Column(name = "is_profile_photo")
    private boolean isProfilePhoto;

    private LocalDateTime created;

    @Override
    public String toString() {
        return "Photo{" +
                "profile=" + profile +
                ", name='" + name + '\'' +
                ", isProfilePhoto=" + isProfilePhoto +
                ", created=" + created +
                '}';
    }
}
~~~
