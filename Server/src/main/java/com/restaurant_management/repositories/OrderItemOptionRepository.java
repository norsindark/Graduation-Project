package com.restaurant_management.repositories;

import com.restaurant_management.entites.OrderItemOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemOptionRepository extends JpaRepository<OrderItemOption, String> {

    @Query(value = "SELECT * FROM order_item_option WHERE order_item_id = ?1", nativeQuery = true)
    List<OrderItemOption> findByOrderItemId(String orderItemId);
}
