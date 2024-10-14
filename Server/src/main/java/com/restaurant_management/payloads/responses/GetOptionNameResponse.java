package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.DishOption;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetOptionNameResponse {
    private String optionId;
    private String optionName;

    public GetOptionNameResponse(DishOption dishOption) {
        this.optionId = dishOption.getId();
        this.optionName = dishOption.getOptionName();
    }
}
