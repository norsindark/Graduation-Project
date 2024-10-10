package com.restaurant_management.repositories;

import com.restaurant_management.entites.DishOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishOptionRepository extends JpaRepository<DishOption, String> {

    boolean existsByOptionName(String optionName);
}
