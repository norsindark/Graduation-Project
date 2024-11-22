package com.restaurant_management.payloads.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class SearchBlogResponse {
    private String id;
    private String title;
    private String slug;
    private String thumbnail;

    public SearchBlogResponse(String id, String title, String slug, String thumbnail) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.thumbnail = thumbnail;
    }
}
