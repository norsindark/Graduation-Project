package com.restaurant_management.repositories;

import com.restaurant_management.entites.Blog;
import com.restaurant_management.payloads.responses.BlogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BlogRepository extends JpaRepository<Blog, String> {

    @Query("SELECT new com.restaurant_management.payloads.responses.BlogResponse(" +
            "b.id, b.title, SUBSTRING(b.content, 1, 100), " +
            "b.status, b.author.fullName, " +
            "b.createdAt, b.updatedAt) " +
            "FROM Blog b")
    Page<BlogResponse> findAllBlogs(Pageable pageable);
}
