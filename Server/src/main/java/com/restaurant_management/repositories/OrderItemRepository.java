package com.restaurant_management.repositories;

import com.restaurant_management.entites.Order;
import com.restaurant_management.entites.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order = ?1")
    List<OrderItem> findByOrder(Order order);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = ?1")
    List<OrderItem> findByOrderId(String orderId);
}
