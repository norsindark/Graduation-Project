package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.DishOptionSelection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishOptionSelectionResponse {
    private String optionSelectionId;
    private String optionName;
    private double additionalPrice;

    public DishOptionSelectionResponse(DishOptionSelection selection) {
        this.optionSelectionId = selection.getId();
        this.optionName = selection.getDishOption().getOptionName();
        this.additionalPrice = selection.getAdditionalPrice();
    }
}
