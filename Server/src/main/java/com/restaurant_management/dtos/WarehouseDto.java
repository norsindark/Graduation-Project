package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseDto {
    private String ingredientName;

    private double importedQuantity;

    private String unit;

    private Timestamp importedDate;

    private Timestamp expiredDate;

    private double importedPrice;

    private String description;

    private String supplierName;

    private String categoryId;
}
