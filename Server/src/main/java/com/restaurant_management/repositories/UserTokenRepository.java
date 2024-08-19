package com.restaurant_management.repositories;

import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.TokenType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserTokenRepository extends JpaRepository<UserToken, String> {
    UserToken findByToken(String token);
    UserToken findByUserAndTokenType(User user, TokenType tokenType);

    List<UserToken> findByUserId(String userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserToken ut WHERE ut.user.id = :userId")
    void deleteByUserId(@Param("userId") String userId);

}
