package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.SignInException;
import com.restaurant_management.exceptions.SignUpException;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.AuthService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request)
            throws SignUpException, MessagingException, UnsupportedEncodingException {
        return new ResponseEntity<>(authService.signUp(request), HttpStatus.CREATED);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> singIn(@Valid @RequestBody SignInRequest request)
            throws SignInException {
        return new ResponseEntity<>(authService.signIn(request), HttpStatus.OK);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam("token") String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }
}
