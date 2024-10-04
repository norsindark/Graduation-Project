package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "dishes")
@Builder
public class Dish {

    @Id
    @UuidGenerator
    @Column(name = "dish_id", length = 36, nullable = false)
    private String id;

    @Column(name = "dish_name", nullable = false)
    private String dishName;

    @Column(name = "description")
    private String description;

    @Column(name = "status", length = 10)
    private String status;

    @Column(name = "thumb_image")
    private String thumbImage;

    @Column(name = "images")
    private String images;

    @Column(name = "offer_price")
    private Double offerPrice;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "category_id")
    @JsonIgnore
    private Category categoryId;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
