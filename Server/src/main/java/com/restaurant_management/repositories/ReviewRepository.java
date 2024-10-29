package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findAllByDish(Dish dish, Pageable pageable);
}
