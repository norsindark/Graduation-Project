package com.restaurant_management.repositories;

import com.restaurant_management.entites.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, String> {
}
