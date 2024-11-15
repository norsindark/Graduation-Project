package com.restaurant_management.payloads.responses;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DishWithRatingResponse {
    private String dishId;
    private String dishName;
    private Double rating;
    private String slug;
    private String description;
    private String status;
    private String thumbImage;
    private Double offerPrice;
    private Double price;

    public DishWithRatingResponse(DishWithRatingResponse  dish, Double rating) {
        this.dishId = dish.getDishId();
        this.dishName = dish.getDishName();
        this.rating = rating;
        this.slug = dish.getSlug();
        this.description = dish.getDescription();
        this.status = dish.getStatus();
        this.thumbImage = dish.getThumbImage();
        this.offerPrice = dish.getOfferPrice();
        this.price = dish.getPrice();
    }
}
