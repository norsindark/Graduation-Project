package com.restaurant_management.repositories;

import com.restaurant_management.entites.CategoryBlog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryBlogRepository extends JpaRepository<CategoryBlog, String> {

    @Query("SELECT c.name AS name, c.id AS id FROM CategoryBlog c")
    List<Object[]> findAllCategoryBlogName();

    Optional<CategoryBlog> findByName(String categoryBlogName);
}
