package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.payloads.responses.SearchDishResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface DishRepository extends JpaRepository<Dish, String> {

    @Query("SELECT new map(d.id as dishId, d.dishName as dishName) FROM Dish d")
    List<Map<String, String>> getAllDishNames();

    @Query("SELECT new com.restaurant_management.payloads.responses.SearchDishResponse(" +
            "d.id, d.dishName, " +
            "d.slug, d.thumbImage, " +
            "d.price, d.offerPrice, " +
            "d.category.name) " +
            "FROM Dish d")
    List<SearchDishResponse> findAllDishToSearch();


}
