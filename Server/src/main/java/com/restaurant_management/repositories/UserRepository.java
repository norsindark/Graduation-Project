package com.restaurant_management.repositories;

import com.restaurant_management.entites.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE LOWER(u.role.name) = LOWER(:roleName)")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT u FROM User u")
    Page<User> findAllUser(Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> findsByEmail(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> findByFullName(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.role.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> findByRoleId(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.status) = LOWER(:keyword)")
    Page<User> findByStatus(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.enabled = :keyword")
    Page<User> findByEnabled(@Param("keyword") Boolean keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.emailVerifiedAt = :keyword")
    Page<User> findByEmailVerifiedAt(@Param("keyword") Timestamp keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.createdAt >= :keyword")
    Page<User> findByCreatedAt(@Param("keyword") Timestamp keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.updatedAt >= :keyword")
    Page<User> findByUpdatedAt(@Param("keyword") Timestamp keyword, Pageable pageable);

}
