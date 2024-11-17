package com.restaurant_management.payloads.requests;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryBlogRequest {
    private String categoryBlogId;
    private String categoryBlogName;
    private String slug;
    private String thumbnail;
    private String status;
    private Integer displayOrder;
}
