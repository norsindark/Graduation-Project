package com.restaurant_management.repositories;

import com.restaurant_management.entites.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, String> {

    Optional<Warehouse> findByIngredientName(String ingredientName);
}
