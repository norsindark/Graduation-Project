package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.util.List;

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

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "thumb_image")
    private String thumbImage;

    @Column(name = "delete_thumb_image")
    private String deleteThumbImage;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishImage> images;

    @Column(name = "offer_price")
    private Double offerPrice;

    @Column(name = "price", nullable = false)
    private Double price;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private Category category;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DishOptionSelection> selectedOptions;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private List<Offer> offers;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}