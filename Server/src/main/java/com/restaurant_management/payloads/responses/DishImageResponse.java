package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.DishImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishImageResponse {
    private String imageId;
    private String imageUrl;

    public DishImageResponse(DishImage dishImage) {
        this.imageId = dishImage.getId();
        this.imageUrl = dishImage.getImageUrl();
    }
}
