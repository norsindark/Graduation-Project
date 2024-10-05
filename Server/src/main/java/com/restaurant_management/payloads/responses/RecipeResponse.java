package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Recipe;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecipeResponse {
    private String id;
    private String ingredientName;
    private Double quantityUsed;
    private String unit;

    public RecipeResponse(Recipe recipe) {
        this.id = recipe.getId();
        this.ingredientName = recipe.getWarehouse().getIngredientName();
        this.quantityUsed = recipe.getQuantityUsed();
        this.unit = recipe.getUnit();
    }
}