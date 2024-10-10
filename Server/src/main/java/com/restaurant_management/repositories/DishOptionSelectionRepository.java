package com.restaurant_management.repositories;

import com.restaurant_management.entites.DishOptionSelection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishOptionSelectionRepository extends JpaRepository<DishOptionSelection, String> {
}
