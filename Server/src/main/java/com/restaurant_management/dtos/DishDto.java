package com.restaurant_management.dtos;

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
public class DishDto {
    private String dishName;
    private String description;
    private String longDescription;
    private String status;
    private MultipartFile thumbImage;
    private List<ImageDto> images;
    private Double offerPrice;
    private Double price;
    private String categoryId;
    private List<RecipeDto> recipes;
    private List<DishOptionSelectionDto> optionSelections;
}
