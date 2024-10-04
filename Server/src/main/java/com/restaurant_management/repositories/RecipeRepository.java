package com.restaurant_management.repositories;

import com.restaurant_management.entites.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, String> {
}
