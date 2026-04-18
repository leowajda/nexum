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
title: FsCommands.java
tree_path: src/main/java/com/tutego/ch_02/springShell/FsCommands.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/springShell/FsCommands.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/springShell/FsCommands.java
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
- label: ch_02
  url: ''
- label: springShell
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/springShell/FsCommands.java
description: FsCommands.java notes
---

~~~java
package com.tutego.ch_02.springShell;

import com.tutego.ch_02.classpathScanning.FileSystem;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.util.unit.DataSize;

@ShellComponent
public class FsCommands {

    private final FileSystem fs = new FileSystem();

    @ShellMethod("Display required free disk space")
    public long minimumFreeDiskSpace() {
        return 1_000_000;
    }

    @ShellMethod("Convert to lowercase string")
    public String toLowercase(String s) {
        return s.toLowerCase();
    }

    @ShellMethod("Display free disk space")
    public String freeDiskSpace() {
        return DataSize.ofBytes(fs.getFreeDiskSpace()).toGigabytes() + " GB";
    }

}
~~~
