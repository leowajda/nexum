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
title: YearMonthRange.java
tree_path: src/main/java/com/tutego/ch_09/mappers/YearMonthRange.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/mappers/YearMonthRange.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/mappers/YearMonthRange.java
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
- label: mappers
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/mappers/YearMonthRange.java
description: YearMonthRange.java notes
---

~~~java
package com.tutego.ch_09.mappers;

import java.time.YearMonth;

// WebDataBinder can manipulate beans, invokes the ConversionService recursively
public class YearMonthRange {
    private YearMonth start, end;


    public YearMonth getStart() {
        return start;
    }

    public void setStart(YearMonth start) {
        this.start = start;
    }

    public YearMonth getEnd() {
        return end;
    }

    public void setEnd(YearMonth end) {
        this.end = end;
    }

    @Override
    public String toString() {
        return "YearMonthRange[start='%s', end='%s']".formatted(start, end);
    }
}
~~~
