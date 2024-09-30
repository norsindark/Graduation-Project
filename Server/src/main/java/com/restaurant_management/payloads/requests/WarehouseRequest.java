package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseRequest {
    private String warehouseId;
    private String rawProductName;
    private double importedQuantity;
    private String unit;
    private String importedDate;
    private String expiredDate;
    private double importedPrice;
    private String description;
    private String supplierName;
    private String categoryId;
}
