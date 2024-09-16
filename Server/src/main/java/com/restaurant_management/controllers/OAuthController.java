package com.restaurant_management.controllers;

import com.restaurant_management.services.interfaces.OAuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Tag(name = "OAuth2")
@RequestMapping("/oauth2")
public class OAuthController {

    private final OAuthService oAuthService;

    @GetMapping("/google/callback")
    public void handleOAuth2Callback(
            @RequestParam(name = "code") String code,
            @RequestParam(name = "state") String state,
            HttpServletResponse response) throws IOException {
        oAuthService.handleOAuth2Callback(code, state, response);
    }
}
