package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.DishImage;
import com.restaurant_management.entites.DishOptionSelection;
import com.restaurant_management.entites.Recipe;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishResponse {

    private String dishId;
    private String dishName;
    private Double rating;
    private int availableQuantity;
    private String slug;
    private String description;
    private String longDescription;
    private String status;
    private String thumbImage;
    private Double offerPrice;
    private Double price;
    private Integer discountPercentage;
    private String categoryId;
    private String categoryName;
    private List<DishImageResponse> images;
    private List<RecipeResponse> recipes;
    private List<ListOptionOfDishResponse> listOptions;

    public DishResponse(Dish dish) {
        this.dishId = dish.getId();
        this.dishName = dish.getDishName();
        this.slug = dish.getSlug();
        this.description = dish.getDescription();
        this.longDescription = dish.getLongDescription();
        this.status = dish.getStatus();
        this.thumbImage = dish.getThumbImage();
        this.offerPrice = dish.getOfferPrice();
        this.price = dish.getPrice();
        this.categoryId = dish.getCategory().getId();
        this.categoryName = dish.getCategory().getName();
    }

    public DishResponse(Dish dish, List<Recipe> recipes, List<DishImage> images, List<DishOptionSelection> optionSelections, int availableQuantity, Double rating, Integer discountPercentage) {
        this.dishId = dish.getId();
        this.dishName = dish.getDishName();
        this.rating = rating;
        this.availableQuantity = availableQuantity;
        this.slug = dish.getSlug();
        this.description = dish.getDescription();
        this.longDescription = dish.getLongDescription();
        this.status = dish.getStatus();
        this.thumbImage = dish.getThumbImage();
        this.offerPrice = dish.getOfferPrice();
        this.price = dish.getPrice();
        this.discountPercentage = discountPercentage;
        this.images = images.stream().map(DishImageResponse::new).toList();
        this.recipes = recipes.stream().map(RecipeResponse::new).toList();
        this.categoryId = dish.getCategory().getId();
        this.categoryName = dish.getCategory().getName();

        this.listOptions = optionSelections.stream()
                .collect(Collectors.groupingBy(
                        selection -> selection.getDishOption().getOptionGroup(),
                        Collectors.mapping(
                                DishOptionSelectionResponse::new,
                                Collectors.toList()
                        )
                ))
                .entrySet().stream()
                .map(entry -> new ListOptionOfDishResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

}