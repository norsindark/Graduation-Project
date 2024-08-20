package com.restaurant_management.controllers;

import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.services.interfaces.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/oauth2")
public class OAuthController {

    private final OAuthService oAuthService;

    @GetMapping("/google/callback")
    public ResponseEntity<ApiResponse> handleOAuth2Callback(
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        if (oAuth2User == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid OAuth2 User", HttpStatus.BAD_REQUEST));
        }

        return ResponseEntity.ok(oAuthService.handleOAuth2Callback(oAuth2User));
    }
}
