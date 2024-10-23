package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponRequest {
    private String code;
    private String description;
    private String status;
    private double discountPercent;
    private double maxDiscount;
    private double minOrderValue;
    private int maxUsage;
    private String startDate;
    private String expirationDate;
}
