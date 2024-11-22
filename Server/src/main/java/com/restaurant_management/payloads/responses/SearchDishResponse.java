package com.restaurant_management.payloads.responses;

import lombok.Data;

@Data
public class SearchDishResponse {
    private String dishId;
    private String dishName;
    private String slug;
    private String thumbnail;
    private Double price;
    private Double offerPrice;
//    private  Double rating;
    private String categoryNames;

    public SearchDishResponse(String id, String dishName, String slug, String thumbnail,
                              Double price, Double offerPrice, String categoryNames) {
        this.dishId = id;
        this.dishName = dishName;
        this.slug = slug;
        this.thumbnail = thumbnail;
        this.price = price;
        this.offerPrice = offerPrice;
//        this.rating = rating;
        this.categoryNames = categoryNames;
    }
}
