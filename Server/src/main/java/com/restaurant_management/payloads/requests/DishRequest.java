package com.restaurant_management.payloads.requests;

import com.restaurant_management.dtos.ImageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishRequest {
    private String dishId;
    private String dishName;
    private String description;
    private String status;
    private MultipartFile thumbImage;
    private List<ImageDto> images;
    private Double offerPrice;
    private Double price;
    private String categoryId;
    private List<RecipeRequest> recipes;
    private List<String> optionIds;
}
