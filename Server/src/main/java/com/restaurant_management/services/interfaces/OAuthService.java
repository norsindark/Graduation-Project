package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuthService {

    JwtResponse handleOAuth2Callback(String code, String state, HttpServletResponse response);

}
