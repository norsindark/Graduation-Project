package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ResetPasswordRequest;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Auth")
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request)
            throws DataExitsException, MessagingException, UnsupportedEncodingException {
        return new ResponseEntity<>(authService.signUp(request), HttpStatus.CREATED);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> singIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response)
            throws DataExitsException {
        return new ResponseEntity<>(authService.signIn(request, response), HttpStatus.OK);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam("token") String token) throws DataExitsException {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @GetMapping("/resend-verification-email")
    public ResponseEntity<ApiResponse> resendVerificationEmail(@RequestParam("email") String email)
            throws MessagingException, UnsupportedEncodingException, DataExitsException {
        return ResponseEntity.ok(authService.resendVerificationEmail(email));
    }

    @GetMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestParam("email") String email)
            throws MessagingException, UnsupportedEncodingException, DataExitsException {
        return ResponseEntity.ok(authService.forgotPassword(email));
    }

    @PostMapping("/reset-password")public ResponseEntity<ApiResponse> resetPassword(
            @RequestBody ResetPasswordRequest request)throws DataExitsException {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
