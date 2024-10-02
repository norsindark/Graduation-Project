package com.restaurant_management.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "warehouse")
@Builder
public class Warehouse {

    @Id
    @UuidGenerator
    @Column(name = "warehouse_id", length = 36, nullable = false)
    private String id;

    @Column(name = "ingredient_name", nullable = false)
    private String ingredientName;

    @Column(name = "imported_quantity", nullable = false)
    private double importedQuantity;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "imported_date", nullable = false)
    private Timestamp importedDate;

    @Column(name = "expired_date", nullable = false)
    private Timestamp expiredDate;

    @Column(name = "available_quantity", nullable = false)
    private double availableQuantity;

    @Column(name = "quantity_used", nullable = false)
    private double quantityUsed;

    @Column(name = "imported_price", nullable = false)
    private double importedPrice;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "supplier_name", nullable = false)
    private String supplierName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false)
    @CreationTimestamp
    private Timestamp updatedAt;
}
