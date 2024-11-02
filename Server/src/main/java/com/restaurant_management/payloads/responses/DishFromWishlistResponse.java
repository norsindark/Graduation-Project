package com.restaurant_management.payloads.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishFromWishlistResponse {
    private String dishId;
    private String dishName;
    private String slug;
    private String description;
    private String status;
    private String thumbImage;
    private Double offerPrice;
    private Double price;

    public DishFromWishlistResponse(DishFromWishlistResponse dish) {
        this.dishId = dish.getDishId();
        this.dishName = dish.getDishName();
        this.slug = dish.getSlug();
        this.description = dish.getDescription();
        this.status = dish.getStatus();
        this.thumbImage = dish.getThumbImage();
        this.offerPrice = dish.getOfferPrice();
        this.price = dish.getPrice();
    }
}
