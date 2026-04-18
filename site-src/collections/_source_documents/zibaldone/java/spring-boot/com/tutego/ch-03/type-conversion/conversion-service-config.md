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
title: ConversionServiceConfig.java
tree_path: src/main/java/com/tutego/ch_03/typeConversion/ConversionServiceConfig.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_03/typeConversion/ConversionServiceConfig.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_03/typeConversion/ConversionServiceConfig.java
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
- label: ch_03
  url: ''
- label: typeConversion
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_03/typeConversion/ConversionServiceConfig.java
description: ConversionServiceConfig.java notes
---

~~~java
package com.tutego.ch_03.typeConversion;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.convert.ApplicationConversionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;

@Configuration
public class ConversionServiceConfig {

    @Bean
    @ConditionalOnMissingBean /* not always injected depends on the classpath */
    public ConversionService conversionService() {
        return ApplicationConversionService.getSharedInstance();
    }

}
~~~
