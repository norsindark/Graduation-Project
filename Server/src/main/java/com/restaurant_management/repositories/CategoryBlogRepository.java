package com.restaurant_management.repositories;

import com.restaurant_management.entites.CategoryBlog;
import com.restaurant_management.payloads.responses.CountBlogByCategoryBlogResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryBlogRepository extends JpaRepository<CategoryBlog, String> {

    @Query("SELECT c.name AS name, c.id AS id FROM CategoryBlog c")
    List<Object[]> findAllCategoryBlogName();

    Optional<CategoryBlog> findByName(String categoryBlogName);

    @Query("SELECT new com.restaurant_management.payloads.responses.CountBlogByCategoryBlogResponse(" +
            "c.name, COUNT(b.id)) " +
            "FROM CategoryBlog c " +
            "JOIN Blog b ON c.id = b.categoryBlog.id " +
            "GROUP BY c.id")
    List<CountBlogByCategoryBlogResponse> countBlogByCategoryBlog();

}
