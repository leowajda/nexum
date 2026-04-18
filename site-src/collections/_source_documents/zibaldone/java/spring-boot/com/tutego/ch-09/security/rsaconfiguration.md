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
title: RSAConfiguration.java
tree_path: src/main/java/com/tutego/ch_09/security/RSAConfiguration.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/security/RSAConfiguration.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/security/RSAConfiguration.java
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
- label: security
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/security/RSAConfiguration.java
description: RSAConfiguration.java notes
---

~~~java
package com.tutego.ch_09.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.nimbusds.jose.jwk.RSAKey;

import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

@Configuration
public class RSAConfiguration {

    @Bean
    public RSAKey rsaKey() throws NoSuchAlgorithmException {
        var generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        var keyPair = generator.generateKeyPair();

        return new RSAKey.Builder((RSAPublicKey) keyPair.getPublic())
                .privateKey((RSAPrivateKey) keyPair.getPrivate())
                .keyID(UUID.randomUUID().toString())
                .build();
    }
}
~~~
