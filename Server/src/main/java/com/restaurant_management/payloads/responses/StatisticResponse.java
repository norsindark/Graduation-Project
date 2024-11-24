package com.restaurant_management.payloads.responses;

import lombok.Data;

@Data
public class StatisticResponse {
    private Double totalRevenue;
    private Integer totalOrders;

    public StatisticResponse(Double totalRevenue, Long totalOrders) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders != null ? totalOrders.intValue() : 0;
    }
}
