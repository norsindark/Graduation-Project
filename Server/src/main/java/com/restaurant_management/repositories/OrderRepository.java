package com.restaurant_management.repositories;

import com.restaurant_management.entites.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {
}
