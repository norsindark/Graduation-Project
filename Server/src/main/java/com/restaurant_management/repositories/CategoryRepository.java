package com.restaurant_management.repositories;

import com.restaurant_management.entites.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {

    @Query("SELECT c FROM Category c WHERE LOWER(c.name) = LOWER(:name)")
    Optional<Category> findByName(@Param("name") String name);

    List<Category> findByParentCategory(Category category);

    @Query("SELECT c FROM Category c")
    Page<Category> findAllCategories(Pageable pageable);

    @Query("SELECT c FROM Category c WHERE c.parentCategory IS NULL")
    Page<Category> findAllParentCategories(Pageable pageable);

    @Query("SELECT c FROM Category c WHERE c.parentCategory.id = :parentId")
    List<Category> findSubCategoriesByParentId(@Param("parentId") String parentId);


}
