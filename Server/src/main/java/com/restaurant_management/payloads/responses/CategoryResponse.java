package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {

    private String id;
    private String name;
    private String thumbnail;
    private String slug;
    private String status;
    private String parentName;
    private String description;
    private String createdAt;
    private String updatedAt;
    private List<CategoryResponse> subCategories;

    public CategoryResponse(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.thumbnail = category.getThumbnail();
        this.slug = category.getSlug();
        this.status = category.getStatus();
        this.description = category.getDescription();
        this.parentName = category.getParentCategory() != null ? category.getParentCategory().getName() : null;
        this.createdAt = category.getCreatedAt().toString();
        this.updatedAt = category.getUpdatedAt().toString();

        this.subCategories = category.getSubCategories().stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }
}

