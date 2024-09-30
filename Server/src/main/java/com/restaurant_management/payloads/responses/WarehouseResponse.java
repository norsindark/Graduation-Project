package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Warehouse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseResponse {
    private String warehouseId;
    private String rawProductName;
    private double importedQuantity;
    private double availableQuantity;
    private double quantityUsed;
    private String unit;
    private String expiredDate;
    private String importedDate;
    private double importedPrice;
    private String supplierName;
    private String description;
    private String categoryName;


    public WarehouseResponse(Warehouse warehouse) {
        this.warehouseId = warehouse.getId();
        this.rawProductName = warehouse.getRawProductName();
        this.importedQuantity = warehouse.getImportedQuantity();
        this.availableQuantity = warehouse.getAvailableQuantity();
        this.quantityUsed = warehouse.getQuantityUsed();
        this.unit = warehouse.getUnit();
        this.expiredDate = warehouse.getExpiredDate().toString();
        this.importedDate = warehouse.getImportedDate().toString();
        this.importedPrice = warehouse.getImportedPrice();
        this.supplierName = warehouse.getSupplierName();
        this.description = warehouse.getDescription();
        this.categoryName = warehouse.getCategory().getName();
    }
}
