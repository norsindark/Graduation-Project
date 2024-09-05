package com.restaurant_management.controllers;

import com.restaurant_management.services.interfaces.OAuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/oauth2")
public class OAuthController {

    private final OAuthService oAuthService;

//    @GetMapping("/google/callback")
//    public ResponseEntity<JwtResponse> handleOAuth2Callback(
//            @RequestParam(name = "code") String code,
//            @RequestParam(name = "state") String state,
//            HttpServletResponse response) {
//        return ResponseEntity.ok(oAuthService.handleOAuth2Callback(code, state, response));
//    }

    @GetMapping("/google/callback")
    public void handleOAuth2Callback(
            @RequestParam(name = "code") String code,
            @RequestParam(name = "state") String state,
            HttpServletResponse response) throws IOException {
        oAuthService.handleOAuth2Callback(code, state, response);
    }
}
