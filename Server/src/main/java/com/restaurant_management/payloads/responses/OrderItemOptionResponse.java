package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.OrderItemOption;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemOptionResponse {
    private String optionId;
    private String optionName;
    private double additionalPrice;

    public OrderItemOptionResponse(OrderItemOption orderItemOption) {
        this.optionId = orderItemOption.getId();
        this.optionName = orderItemOption.getDishOptionSelection().getDishOption().getOptionName();
        this.additionalPrice = orderItemOption.getAdditionalPrice() != null ?
                orderItemOption.getAdditionalPrice() : 0.0;
    }
}
