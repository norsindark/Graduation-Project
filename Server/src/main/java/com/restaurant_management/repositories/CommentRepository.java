package com.restaurant_management.repositories;

import com.restaurant_management.entites.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, String> {

    @Query("SELECT c FROM Comment c WHERE c.blog.id = :blogId ORDER BY c.createdAt")
    Page<Comment> findAllByBlogId(@Param("blogId") String blogId, Pageable pageable);
}
