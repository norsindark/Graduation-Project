package com.restaurant_management.repositories;

import com.restaurant_management.entites.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String> {

}
