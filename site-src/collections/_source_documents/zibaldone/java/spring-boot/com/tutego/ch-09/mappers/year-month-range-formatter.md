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
title: YearMonthRangeFormatter.java
tree_path: src/main/java/com/tutego/ch_09/mappers/YearMonthRangeFormatter.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/mappers/YearMonthRangeFormatter.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/mappers/YearMonthRangeFormatter.java
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
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/mappers/YearMonthRangeFormatter.java
description: YearMonthRangeFormatter.java notes
---

~~~java
package com.tutego.ch_09.mappers;

import org.springframework.format.Formatter;

import java.text.ParseException;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import java.util.regex.Pattern;

class YearMonthRangeFormatter implements Formatter<YearMonthRange> {

    @Override
    public String print(YearMonthRange range, Locale locale) {
        return range.getStart() + "~" + range.getEnd();
    }

    @Override
    public YearMonthRange parse(String s, Locale locale) throws ParseException {
        try {
            var startEnd = Pattern.compile("~").splitAsStream(s)
                    .map(YearMonth::parse)
                    .toArray(YearMonth[]::new);

            var yearMonthRange = new YearMonthRange();
            yearMonthRange.setStart(startEnd[0]);
            yearMonthRange.setEnd(startEnd[1]);

            return yearMonthRange;
        } catch (DateTimeParseException e) {
            throw new ParseException(e.getMessage(), e.getErrorIndex());
        } catch (ArrayIndexOutOfBoundsException e) {
            throw new ParseException("Insufficient number of values", 0);
        }
    }
}
~~~
