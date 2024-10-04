package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishDto {

    private String dishName;
    private String description;
    private String status;
    private String thumbImage;
    private String images;
    private Double offerPrice;
    private Double price;
    private String categoryId;

    private List<RecipeDto> recipes;
}
