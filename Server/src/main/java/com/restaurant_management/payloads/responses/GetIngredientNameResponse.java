package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Warehouse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetIngredientNameResponse {
    private String warehouseId;
    private String ingredientName;

    public GetIngredientNameResponse(Warehouse warehouse) {
        this.warehouseId = warehouse.getId();
        this.ingredientName = warehouse.getIngredientName();
    }
}
