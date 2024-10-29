package com.restaurant_management.repositories;

import com.restaurant_management.entites.LocationRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRestaurantRepository extends JpaRepository<LocationRestaurant, String> {
}
