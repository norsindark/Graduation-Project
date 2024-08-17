package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.SignInException;
import com.restaurant_management.exceptions.SignUpException;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface AuthService {
    ApiResponse signUp(SignUpRequest signUpRequest) throws SignUpException, MessagingException, UnsupportedEncodingException;

    JwtResponse signIn(SignInRequest signInRequest) throws SignInException;

    ApiResponse verifyEmail(String token);
}
