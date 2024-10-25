package com.restaurant_management.repositories;

import com.restaurant_management.entites.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    @Query("SELECT u.email FROM User u JOIN Order o ON u.id = o.user.id WHERE o.id = ?1")
    String findEmailFromUserByOrderId(String orderId);

    List<Order> findByUserId(String userId);
}
