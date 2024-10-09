package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.DishImage;
import com.restaurant_management.entites.Recipe;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishResponse {

    private String id;
    private String dishName;
    private String description;
    private String status;
    private String thumbImage;
    private Double offerPrice;
    private Double price;
    private List<DishImageResponse> images;
    private List<RecipeResponse> recipes;
    private String categoryId;
    private String categoryName;

    public DishResponse(Dish dish, List<Recipe> recipes, List<DishImage> images) {
        this.id = dish.getId();
        this.dishName = dish.getDishName();
        this.description = dish.getDescription();
        this.status = dish.getStatus();
        this.thumbImage = dish.getThumbImage();
        this.offerPrice = dish.getOfferPrice();
        this.price = dish.getPrice();
        this.images = images.stream().map(DishImageResponse::new).toList();
        this.recipes = recipes.stream().map(RecipeResponse::new).toList();
        this.categoryId = dish.getCategory().getId();
        this.categoryName = dish.getCategory().getName();
    }
}