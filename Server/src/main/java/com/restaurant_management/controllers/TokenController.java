package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.InvalidTokenException;
import com.restaurant_management.payloads.requests.RefreshTokenRequest;
import com.restaurant_management.services.interfaces.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/auth")
public class TokenController {

    private final TokenService tokenService;

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) throws InvalidTokenException {
        return ResponseEntity.ok(tokenService.refreshAccessToken(request));
    }

}
