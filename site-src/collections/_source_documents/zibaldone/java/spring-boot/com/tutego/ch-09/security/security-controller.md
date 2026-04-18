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
title: SecurityController.java
tree_path: src/main/java/com/tutego/ch_09/security/SecurityController.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/security/SecurityController.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/security/SecurityController.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/security/SecurityController.java
description: SecurityController.java notes
---

~~~java
package com.tutego.ch_09.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/security")
public class SecurityController {

    private final JwtEncoder jwtEncoder;

    public SecurityController(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @GetMapping("/tip")
    public String shortQuote() {
        return "Die with memories, not dreams.";
    }

    @GetMapping("/stats")
    public String numberOfRegisteredUnicorns(@AuthenticationPrincipal Jwt jwt) {
        return jwt.toString();
    }

    @GetMapping("/name")
    public String currentUserName(Authentication principal) {
        return principal.getName();
    }

    @PostMapping("/login")
    public String token(Authentication authentication) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(authentication.getName())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
~~~
