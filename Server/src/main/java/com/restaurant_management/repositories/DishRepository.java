package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishRepository extends JpaRepository<Dish, String> {

}
