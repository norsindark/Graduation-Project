package com.restaurant_management.services.interfaces;

import com.restaurant_management.payloads.responses.JwtResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface OAuthService {

    JwtResponse handleOAuth2Callback(String code, String state, HttpServletResponse response);

}
