package com.restaurant_management.payloads.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCategoriesNameResponse {
    private String categoryId;
    private String categoryName;
    private String categoryStatus;
}
