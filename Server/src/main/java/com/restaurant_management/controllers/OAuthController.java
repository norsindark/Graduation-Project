package com.restaurant_management.controllers;

import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.services.interfaces.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/oauth2")
public class OAuthController {

    private final OAuthService oAuthService;

    @GetMapping("/google/callback")
    public ResponseEntity<JwtResponse> handleOAuth2Callback(
            @RequestParam(name = "code") String code,
            @RequestParam(name = "state") String state) {
        return ResponseEntity.ok(oAuthService.handleOAuth2Callback(code, state));
    }
}
