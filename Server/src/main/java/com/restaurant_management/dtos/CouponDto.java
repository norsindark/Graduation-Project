package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponDto {
    private String code;
    private Double discountPercent;
    private Double minOrderValue;
    private Double maxDiscount;
    private String description;
    private Integer maxUsage;
    private String startDate;
    private String expirationDate;
}
