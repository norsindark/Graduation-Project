package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.Order;
import com.restaurant_management.entites.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String orderId;
    private String userId;
    private String userEmail;
    private String orderStatus;
    private double totalPrice;
    private String createdAt;
    private AddressResponse address;
    private List<OrderItemResponse> orderItems;

    public OrderResponse(Order order, Address address, List<OrderItem> orderItems) {
        this.orderId = order.getId();
        this.userId = order.getUser().getId();
        this.userEmail = order.getUser().getEmail();
        this.orderStatus = order.getStatus();
        this.totalPrice = order.getTotalPrice();
        this.createdAt = order.getCreatedAt().toString();
        this.address = AddressResponse.toAddress(address);
        this.orderItems = orderItems.stream().map(OrderItemResponse::new).toList();
    }
}

