package com.restaurant_management.repositories;

import com.restaurant_management.entites.Order;
import com.restaurant_management.entites.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    @Query("SELECT u.email FROM User u JOIN Order o ON u.id = o.user.id WHERE o.id = ?1")
    String findEmailFromUserByOrderId(String orderId);

    @Query("SELECT COUNT(i) > 0 FROM Order o JOIN o.items i WHERE o.user.id = ?1 AND i.dish.id = ?2")
    boolean existsByUserIdAndDishId(String userId, String dishId);

    Page<Order> findByUser(User user, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.status = 'COMPLETED'")
    List<Order> findCompletedOrders();
}
