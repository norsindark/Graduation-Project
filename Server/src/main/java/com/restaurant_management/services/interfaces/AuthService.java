package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ResetPasswordRequest;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.mail.MessagingException;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.UnsupportedEncodingException;

public interface AuthService {
    ApiResponse signUp(SignUpRequest signUpRequest) throws DataExitsException, MessagingException, UnsupportedEncodingException;
    ApiResponse signUp(SignUpRequest signUpRequest) throws DataExitsException, MessagingException, UnsupportedEncodingException;

    JwtResponse signIn(SignInRequest signInRequest) throws DataExitsException;
    JwtResponse signIn(SignInRequest signInRequest) throws DataExitsException;

    ApiResponse verifyEmail(String token);

    ApiResponse resendVerificationEmail(String email) throws MessagingException, UnsupportedEncodingException, DataExitsException;

    ApiResponse forgotPassword(String email) throws MessagingException, UnsupportedEncodingException, DataExitsException;

    ApiResponse resetPassword(ResetPasswordRequest request) throws DataExitsException;

}
