package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.Order;
import com.restaurant_management.entites.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String orderId;
    private String userId;
    private String userEmail;
    private String orderStatus;
    private String paymentMethod;
    private double totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AddressResponse address;
    private List<OrderItemResponse> orderItems;

    public OrderResponse(Order order, Address address, List<OrderItem> orderItems) {
        this.orderId = order.getId();
        this.userId = order.getUser().getId();
        this.userEmail = order.getUser().getEmail();
        this.orderStatus = order.getStatus();
        this.paymentMethod = order.getPaymentMethod();
        this.totalPrice = order.getTotalPrice();
        this.createdAt = order.getCreatedAt();
        this.updatedAt = order.getUpdatedAt();
        this.address =  (address != null) ? AddressResponse.toAddress(address) : null;
        this.orderItems = orderItems.stream().map(OrderItemResponse::new).toList();
    }
}

