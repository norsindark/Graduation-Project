package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ResetPasswordRequest;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

import java.io.UnsupportedEncodingException;

public interface AuthService {
    ApiResponse signUp(SignUpRequest signUpRequest) throws DataExitsException, MessagingException, UnsupportedEncodingException;

    JwtResponse signIn(SignInRequest signInRequest, HttpServletResponse response) throws DataExitsException;

    ApiResponse verifyEmail(String token) throws DataExitsException;

    ApiResponse resendVerificationEmail(String email) throws MessagingException, UnsupportedEncodingException, DataExitsException;

    ApiResponse forgotPassword(String email) throws MessagingException, UnsupportedEncodingException, DataExitsException;

    ApiResponse resetPassword(ResetPasswordRequest request) throws DataExitsException;

}
