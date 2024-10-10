package com.restaurant_management.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "coupons")
public class Coupon {

    @Id
    @UuidGenerator
    @Column(name = "coupon_id", length = 36, nullable = false)
    private String Id;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "discount_percent")
    private Double discountPercent;

    @Column(name = "min_order_value")
    private Double minOrderValue;

    @Column(name = "max_discount")
    private Double maxDiscount;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "expiration_date")
    private String expirationDate;
}
