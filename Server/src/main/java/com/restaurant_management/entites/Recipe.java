package com.restaurant_management.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "recipes")
@Builder
public class Recipe {

    @Id
    @UuidGenerator
    @Column(name = "recipe_id", length = 36, nullable = false)
    private String id;

    @Column(name = "dish_id", nullable = false)
    private Dish dish;

    @Column(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "quantity_used", nullable = false)
    private Double quantityUsed;

    @Column(name = "unit", length = 20, nullable = false)
    private String unit;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;

}
