package com.restaurant_management.dtos;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogDto {
    private String id;
    private String thumbnail;
    private String title;
    private String content;
    private String seoTitle;
    private String seoDescription;
    private String tags;
    private String author;
    private String status;
    private String categoryBlogId;
}
