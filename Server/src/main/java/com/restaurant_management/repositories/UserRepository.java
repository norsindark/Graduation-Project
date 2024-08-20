package com.restaurant_management.repositories;

import com.restaurant_management.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

//    Optional<User> findById(String userId);
}
