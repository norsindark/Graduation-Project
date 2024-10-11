package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.DishOptionSelection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DishOptionSelectionRepository extends JpaRepository<DishOptionSelection, String> {

    @Query("SELECT d.id, d.additionalPrice FROM DishOptionSelection d WHERE d.id IN :optionSelectionIds")
    List<Object[]> findAllById(List<String> optionSelectionIds);

    @Modifying
    @Query("UPDATE DishOptionSelection d SET d.additionalPrice = :newPrice WHERE d.id = :id")
    void updateAdditionalPriceById(@Param("id") String id, @Param("newPrice") Double newPrice);


    @Query("SELECT dos FROM DishOptionSelection dos WHERE dos.dish = :dish")
    List<DishOptionSelection> findByDish(@Param("dish") Dish dish);
}
