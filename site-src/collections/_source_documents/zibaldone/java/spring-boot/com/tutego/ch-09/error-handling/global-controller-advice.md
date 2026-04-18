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
title: GlobalControllerAdvice.java
tree_path: src/main/java/com/tutego/ch_09/errorHandling/GlobalControllerAdvice.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_09/errorHandling/GlobalControllerAdvice.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_09/errorHandling/GlobalControllerAdvice.java
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
- label: errorHandling
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_09/errorHandling/GlobalControllerAdvice.java
description: GlobalControllerAdvice.java notes
---

~~~java
package com.tutego.ch_09.errorHandling;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.net.URI;

@ControllerAdvice
class GlobalControllerAdvice {

    @ExceptionHandler // 3. local exception handling through an @ExceptionHandler
    public ResponseEntity<String> indexOutOfBoundsExceptionHandler(IndexOutOfBoundsException ex) {
        var problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problemDetail.setTitle("The index is out of bound");
        problemDetail.setDetail(ex.getMessage());
        problemDetail.setType(URI.create("https://docs.oracle.com/en/java/javase/17/docs/api/java.base/" + "java/lang/IndexOutOfBoundsException.html"));
        return ResponseEntity.of(problemDetail).build();
    }

    @ExceptionHandler // A TypeMismatchException raised while resolving a controller method argument
    public ResponseEntity<?> yearMonthMisformatted(MethodArgumentTypeMismatchException e) {
        var problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("The format of the argument '" + e.getName() + "' is wrong");
        problem.setDetail("The format of '" + e.getValue() + "' is invalid. The form at string must match ISO 8601 format 'YYYY-MM', like '2025-03'");
        problem.setType(URI.create("https://www.iso.org/iso-8601-date-and-time-format.html"));
        return ResponseEntity.of(problem).build();
    }

}
~~~
