package com.restaurant_management.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dish_option_selections")
@Builder
public class DishOptionSelection {

    @Id
    @UuidGenerator
    @Column(name = "dish_option_selection_id", length = 36, nullable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @ManyToOne
    @JoinColumn(name = "dish_option_id", nullable = false)
    private DishOption dishOption;

    @Column(name = "additional_price")
    private Double additionalPrice;
}
