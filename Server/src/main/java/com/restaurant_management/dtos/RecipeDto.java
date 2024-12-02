package com.restaurant_management.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeDto {
    private String warehouseId;

    @NotBlank(message = "Ingredient name is required")
    private Double quantityUsed;

    @NotBlank(message = "Unit is required")
    private String unit;
}
