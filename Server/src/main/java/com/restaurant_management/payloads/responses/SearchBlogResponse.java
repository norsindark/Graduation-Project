package com.restaurant_management.payloads.responses;

import lombok.Data;

@Data
public class SearchBlogResponse {
    private String id;
    private String title;
    private String slug;
    private String thumbnail;
    private String author;

    public SearchBlogResponse(String id, String title, String slug, String thumbnail, String author) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.thumbnail = thumbnail;
        this.author = author;
    }
}
