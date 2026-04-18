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
title: AwtNearestNeighborThumbnail.java
tree_path: src/main/java/com/tutego/ch_02/beanQualification/thumbnail/AwtNearestNeighborThumbnail.java
source_path: java/spring-boot/src/main/java/com/tutego/ch_02/beanQualification/thumbnail/AwtNearestNeighborThumbnail.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/spring-boot/src/main/java/com/tutego/ch_02/beanQualification/thumbnail/AwtNearestNeighborThumbnail.java
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
- label: beanQualification
  url: ''
- label: thumbnail
  url: ''
document_id: java:spring-boot:src/main/java/com/tutego/ch_02/beanQualification/thumbnail/AwtNearestNeighborThumbnail.java
description: AwtNearestNeighborThumbnail.java notes
---

~~~java
package com.tutego.ch_02.beanQualification.thumbnail;

import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;

@Order(1)
@Primary // can be used with all dependency injections
@Service("fastThumbnailRenderer")
@ThumbnailRendering(ThumbnailRendering.RenderingQuality.FAST)
public class AwtNearestNeighborThumbnail implements Thumbnail {

    private static BufferedImage create(BufferedImage source, int width, int height) {
        double thumbRatio = (double) width / height;
        double imageRatio = (double) source.getWidth() / source.getHeight();

        if (thumbRatio < imageRatio) height = (int) (width / imageRatio);
        else width = (int) (height * imageRatio);

        var thumb = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        var g2 = thumb.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
        g2.drawImage(source, 0, 0, width, height, null);
        g2.dispose();

        return thumb;
    }

    @Override
    public byte[] thumbnail(byte[] imageBytes) {
        try (var is = new ByteArrayInputStream(imageBytes); var baos = new ByteArrayOutputStream()) {
            ImageIO.write(create(ImageIO.read(is), 200, 200), "jpg", baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
~~~
