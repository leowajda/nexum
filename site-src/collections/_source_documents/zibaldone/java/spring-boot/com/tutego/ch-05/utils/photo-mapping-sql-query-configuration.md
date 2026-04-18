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
title: PhotoMappingSqlQueryConfiguration.java
tree_path: src/main/java/com/tutego/ch_05/utils/PhotoMappingSqlQueryConfiguration.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_05/utils/PhotoMappingSqlQueryConfiguration.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_05/utils/PhotoMappingSqlQueryConfiguration.java
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
- label: utils
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_05/utils/PhotoMappingSqlQueryConfiguration.java
description: PhotoMappingSqlQueryConfiguration.java notes
---

~~~java
package com.tutego.ch_05.utils;

import com.tutego.ch_05.batchOperation.Photo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.MappingSqlQuery;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;

import static java.sql.Types.BOOLEAN;
import static java.sql.Types.TIMESTAMP;

@Configuration(proxyBeanMethods = false)
public class PhotoMappingSqlQueryConfiguration {

    @Bean
    public MappingSqlQuery<Photo> photoMappingSqlQuery(DataSource dataSource) {
        var sqlQuery = new MappingSqlQuery<Photo>(
                dataSource,
                "SELECT id, profile_fk, name, is_profile_photo, created FROM Photo WHERE is_profile_photo = ? AND created > ?"
        ) {
            @Override
            protected Photo mapRow(ResultSet rs, int rowNum) throws SQLException {
                return new Photo(
                        rs.getLong("profile_fk"),
                        rs.getString("name"),
                        rs.getBoolean("is_profile_photo"),
                        rs.getTimestamp("created").toLocalDateTime()
                );
            }
        };

        // pretty bad interface, even with the MappingSqlQuery<T> the interface is not typed
        sqlQuery.declareParameter(new SqlParameter("is_profile_photo", BOOLEAN));
        sqlQuery.declareParameter(new SqlParameter("created", TIMESTAMP));
        return sqlQuery;
    }


}
~~~
