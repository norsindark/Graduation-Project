package com.restaurant_management.services.interfaces;

import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.RefreshTokenRequest;
import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

import java.io.UnsupportedEncodingException;

public interface TokenService {
    public void createEmailVerificationToken(User user) throws MessagingException, UnsupportedEncodingException;

    public void createPasswordResetToken(User user) throws MessagingException, UnsupportedEncodingException;

    public JwtResponse refreshAccessToken(RefreshTokenRequest refreshToken, HttpServletResponse response) throws DataExitsException;

}
