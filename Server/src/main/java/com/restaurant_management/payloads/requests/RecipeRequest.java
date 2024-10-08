package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeRequest {
    private String recipeId;
    private String warehouseId;
    private Double quantityUsed;
    private String unit;
}
