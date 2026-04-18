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
title: Unicorn.java
tree_path: src/main/java/com/tutego/ch_06/advanced/Unicorn.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_06/advanced/Unicorn.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_06/advanced/Unicorn.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_06/advanced/Unicorn.java
description: Unicorn.java notes
---

~~~java
package com.tutego.ch_06.advanced;

import com.tutego.ch_06.read.Profile;
import jakarta.persistence.*;

@Entity
@Access(AccessType.FIELD)
public class Unicorn extends AbstractEntity {

    @Embedded
    @AttributeOverrides(
            value = {
                    @AttributeOverride(name = "email", column = @Column(name = "email")),
                    @AttributeOverride(name = "password", column = @Column(name = "password"))
            }
    )
    private LoginCredentials credentials;

    @OneToOne
    @JoinColumn(name = "profile_fk") // loaded eagerly
    private Profile profile;


    @Override
    public String toString() {
        return "Unicorn{" +
                "credentials=" + credentials +
                ", profile=" + profile +
                '}';
    }
}
~~~
