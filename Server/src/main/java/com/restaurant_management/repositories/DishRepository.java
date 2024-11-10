package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface DishRepository extends JpaRepository<Dish, String> {

    @Query("SELECT new map(d.id as dishId, d.dishName as dishName) FROM Dish d")
    List<Map<String, String>> getAllDishNames();
}
