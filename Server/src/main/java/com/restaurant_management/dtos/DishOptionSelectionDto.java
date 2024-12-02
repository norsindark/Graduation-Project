package com.restaurant_management.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishOptionSelectionDto {
    private String optionId;

    @NotBlank(message = "Option name is required")
    private double additionalPrice;
}
