package com.restaurant_management.repositories;

import com.restaurant_management.entites.Order;
import com.restaurant_management.entites.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order = ?1")
    List<OrderItem> findByOrder(Order order);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = ?1")
    List<OrderItem> findByOrderId(String orderId);

    @Query("SELECT new map(i.dish.dishName as dishName, SUM(i.quantity) as totalQuantity) " +
            "FROM OrderItem i JOIN i.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY i.dish.dishName")
    List<Map<String, Long>> getDishSalesStatistics();

    @Query("SELECT new map(i.dish.dishName as dishName, " +
            "SUM(i.quantity * i.price) as totalRevenue) " +
            "FROM OrderItem i " +
            "JOIN i.order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY i.dish.dishName")
    List<Map<String, Double>> getDishSalesRevenue();

    @Query("SELECT new map(i.dish.dishName as dishName, " +
            "SUM(i.quantity * (r.warehouse.importedPrice * r.quantityUsed / r.warehouse.importedQuantity)) as totalCost) " +
            "FROM OrderItem i " +
            "JOIN i.order o " +
            "JOIN Recipe r ON i.dish.id = r.dish.id " +
            "JOIN Warehouse w ON r.warehouse.id = w.id " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY i.dish.dishName")
    List<Map<String, Double>> getDishSalesCost();
}
