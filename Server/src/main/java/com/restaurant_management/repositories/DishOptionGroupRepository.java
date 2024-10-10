package com.restaurant_management.repositories;

import com.restaurant_management.entites.DishOptionGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishOptionGroupRepository extends JpaRepository<DishOptionGroup, String> {

    boolean existsByGroupName(String name);
}
