package com.restaurant_management.repositories;

import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken, String> {
    UserToken findByToken(String token);
    UserToken findByUserAndTokenType(User user, TokenType tokenType);
    void deleteByToken(String token);

}