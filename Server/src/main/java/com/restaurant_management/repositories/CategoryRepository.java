package com.restaurant_management.repositories;

import com.restaurant_management.entites.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);

    @Query("SELECT c FROM Category c")
    Page<Category> findAllCategories(Pageable pageable);
}
