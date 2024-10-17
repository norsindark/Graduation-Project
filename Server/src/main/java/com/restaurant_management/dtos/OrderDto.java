package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private String userId;
    private String addressId;
    private String couponId;
    private String paymentMethod;
    private List<OrderItemDto> items;
    private String note;
}
