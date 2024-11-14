package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Blog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
//@AllArgsConstructor
public class BlogResponse {
    private String id;
    private String title;
    private String content;
    private String status;
    private String author;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public BlogResponse(Blog blog) {
        this.id = blog.getId();
        this.title = blog.getTitle();
        this.content = blog.getContent();
        this.status = blog.getStatus();
        this.author = blog.getAuthor().getUsername();
        this.createdAt = blog.getCreatedAt();
        this.updatedAt = blog.getUpdatedAt();
    }

    public BlogResponse(String id, String title, String content,
                        String status, String author, Timestamp createdAt, Timestamp updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = status;
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
