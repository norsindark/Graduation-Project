package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
@Builder
@Table(name = "dish_options")
public class DishOption {

    @Id
    @UuidGenerator
    @Column(name = "dish_option_id", length = 36, nullable = false)
    private String Id;

    @Column(name = "option_name", nullable = false)
    private String optionName;

    @Column(name = "additional_price")
    private Double additionalPrice;

    @ManyToOne
    @JoinColumn(name = "dish_option_group_id", nullable = false)
    @JsonIgnore
    private DishOptionGroup optionGroup;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
