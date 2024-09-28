package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubCategoryRequest {
    private String id;
    private String name;
    private String slug;
    private String status;
    private String description;
}
