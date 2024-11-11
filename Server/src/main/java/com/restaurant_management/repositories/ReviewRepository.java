package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findAllByDish(Dish dish, Pageable pageable);

    Page<Review> findAllByUserId(String userId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.dish.id = :dishId")
    Double getAverageRatingByDishId(@Param("dishId") String dishId);

}
