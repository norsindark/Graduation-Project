package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private String itemId;
    private String dishId;
    private String dishName;
    private double price;
    private int quantity;
    private double totalPrice;
    private String thumbImage;
    private List<OrderItemOptionResponse> options;

    public OrderItemResponse(OrderItem orderItem) {
        this.itemId = orderItem.getId();
        this.dishId = orderItem.getDish().getId();
        this.dishName = orderItem.getDish().getDishName();
        this.price = orderItem.getPrice();
        this.quantity = orderItem.getQuantity();
        this.totalPrice = orderItem.getTotalPrice();
        this.thumbImage = orderItem.getDish().getThumbImage();
        this.options = orderItem.getOptions().stream().map(OrderItemOptionResponse::new).toList();
    }
}
