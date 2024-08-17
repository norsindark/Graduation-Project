package com.restaurant_management.services.interfaces;

import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.InvalidTokenException;
import com.restaurant_management.payloads.requests.RefreshTokenRequest;
import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface TokenService {
    public void createEmailVerificationToken(User user) throws MessagingException, UnsupportedEncodingException;

    public void createPasswordResetToken(User user) throws MessagingException, UnsupportedEncodingException;

    public JwtResponse refreshAccessToken(RefreshTokenRequest refreshToken) throws InvalidTokenException;

    public void saveRefreshToken(User user);

    public  void saveAccessToken(User user, String token);
}
