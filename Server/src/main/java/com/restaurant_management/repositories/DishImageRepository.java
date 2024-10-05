package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.DishImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DishImageRepository extends JpaRepository<DishImage, String> {

    @Query("SELECT d FROM DishImage d WHERE d.dish = ?1")
    List<DishImage> findByDish(Dish dish);
}
