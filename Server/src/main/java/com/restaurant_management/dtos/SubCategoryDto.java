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
public class SubCategoryDto {
    @NotBlank(message = "Subcategory name is required")
    @Pattern(regexp = "^[a-zA-Z ]+$", message = "Subcategory name must be alphanumeric")
    private String name;

    private String description;

    private String status;
}