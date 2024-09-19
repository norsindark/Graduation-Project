package com.restaurant_management.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {

    private String id;

    @NotBlank(message = "Category name is required")
    @Pattern(regexp = "^[a-zA-Z ]+$", message = "Category name must be alphanumeric")
    private String name;

    private String slug;

    private String status;

    private String parentId;

    private String description;
}
