package com.restaurant_management.services.interfaces;

import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.RefreshTokenRequest;
import com.restaurant_management.payloads.responses.RefreshTokenResponse;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface TokenService {
    public void createEmailVerificationToken(User user) throws MessagingException, UnsupportedEncodingException;

    public void createPasswordResetToken(User user) throws MessagingException, UnsupportedEncodingException;

    public RefreshTokenResponse refreshAccessToken(RefreshTokenRequest refreshToken) throws DataExitsException;

}
