package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryRequest {
    private String id;
    private String name;
    private String slug;
    private String status;
    private String description;
    private List<SubCategoryRequest> subCategories;
}
