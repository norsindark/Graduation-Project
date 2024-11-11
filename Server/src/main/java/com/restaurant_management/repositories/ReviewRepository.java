package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Review;
import com.restaurant_management.payloads.responses.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findAllByDish(Dish dish, Pageable pageable);

    @Query("SELECT new com.restaurant_management.payloads.responses.ReviewResponse( " +
            "r.id, r.rating, r.comment, r.dish.id, r.dish.dishName, " +
            "r.user.id, r.user.fullName, r.user.avatar, r.createdAt) " +
            "FROM Review r WHERE r.user.id = :userId")
    Page<ReviewResponse> findAllByUserId(@Param("userId") String userId, Pageable pageable);


    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.dish.id = :dishId")
    Double getAverageRatingByDishId(@Param("dishId") String dishId);
}
