package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.DishOption;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishOptionResponse {
    private String optionId;
    private String optionName;

    public DishOptionResponse(DishOption dishOption) {
        this.optionId = dishOption.getId();
        this.optionName = dishOption.getOptionName();
    }
}
