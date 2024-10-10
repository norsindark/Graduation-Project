package com.restaurant_management.repositories;

import com.restaurant_management.entites.OrderItemOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemOptionRepository extends JpaRepository<OrderItemOption, String> {
}
