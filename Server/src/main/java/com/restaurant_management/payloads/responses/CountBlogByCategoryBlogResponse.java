package com.restaurant_management.payloads.responses;

import lombok.Data;

@Data
public class CountBlogByCategoryBlogResponse {
    private String categoryBlogName;
    private Long countBlog;

    public CountBlogByCategoryBlogResponse(String name, Long countBlog) {
        this.categoryBlogName = name;
        this.countBlog = countBlog;
    }
}
