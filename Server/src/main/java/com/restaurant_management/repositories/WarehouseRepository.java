package com.restaurant_management.repositories;

import com.restaurant_management.entites.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, String> {

    Optional<Warehouse> findByIngredientName(String ingredientName);

    @Query("SELECT w FROM Warehouse w WHERE w.expiredDate BETWEEN CURRENT_TIMESTAMP AND :upcomingDate")
    Page<Warehouse> findNearlyExpiredIngredients(@Param("upcomingDate") Timestamp upcomingDate, Pageable pageable);

    @Query("SELECT w FROM Warehouse w WHERE w.expiredDate BETWEEN CURRENT_TIMESTAMP AND :upcomingDate OR w.expiredDate < CURRENT_TIMESTAMP")
    Page<Warehouse> findExpiredAndNearlyExpiredIngredients(@Param("upcomingDate") Timestamp upcomingDate, Pageable pageable);

    @Query("SELECT w FROM Warehouse w WHERE w.availableQuantity < :threshold")
    List<Warehouse> findLowStockIngredients(@Param("threshold") double threshold);
}
