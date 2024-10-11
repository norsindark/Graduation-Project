package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.DishOptionGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListOptionOfDishResponse {
    private String optionGroupId;
    private String optionGroupName;
    private List<DishOptionSelectionResponse> options;

    public ListOptionOfDishResponse(DishOptionGroup group, List<DishOptionSelectionResponse> selections) {
        this.optionGroupId = group.getId();
        this.optionGroupName = group.getGroupName();
        this.options = selections;
    }
}

