package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, String> {

    boolean existsByDish(Dish dish);

    List<Offer> findAllByDish(Dish dish);

    @Query("SELECT o FROM Offer o WHERE o.dish.id = :dishId")
    Optional<Offer> findByDishId(@Param("dishId") String dishId);
}
