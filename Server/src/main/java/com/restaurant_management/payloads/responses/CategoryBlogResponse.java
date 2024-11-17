package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.CategoryBlog;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class CategoryBlogResponse {
    private String categoryBlogId;
    private String categoryName;
    private String slug;
    private String status;
    private String thumbnail;
    private Integer displayOrder;
    private Timestamp createdDate;
    private Timestamp updatedDate;

    public CategoryBlogResponse(CategoryBlog categoryBlog) {
        this.categoryBlogId = categoryBlog.getId();
        this.categoryName = categoryBlog.getName();
        this.slug = categoryBlog.getSlug();
        this.status = categoryBlog.getStatus();
        this.displayOrder = categoryBlog.getDisplayOrder();
        this.thumbnail = categoryBlog.getThumbnail();
        this.createdDate = categoryBlog.getCreatedAt();
        this.updatedDate = categoryBlog.getUpdatedAt();
    }
}
