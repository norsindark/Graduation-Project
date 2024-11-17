package com.restaurant_management.payloads.requests;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBlogRequest {
    private String categoryBlogId;
    private String categoryBlogName;
    private String slug;
    private String thumbnail;
    private String status;
    private Integer displayOrder;
}
