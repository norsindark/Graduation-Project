package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Wishlist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistResponse {
    private String WishlistId;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DishWithRatingResponse> dishes;

    public WishlistResponse(Wishlist wishlist, List<DishWithRatingResponse> dishes) {
        this.WishlistId = wishlist.getId();
        this.userId = wishlist.getUser().getId();
        this.createdAt = wishlist.getCreatedAt();
        this.updatedAt = wishlist.getUpdatedAt();
        this.dishes = dishes.stream().map(dish -> new DishWithRatingResponse(dish, dish.getRating())).collect(Collectors.toList());

    }
}