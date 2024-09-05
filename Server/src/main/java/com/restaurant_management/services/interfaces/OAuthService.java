package com.restaurant_management.services.interfaces;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface OAuthService {

    void handleOAuth2Callback(String code, String state, HttpServletResponse response) throws IOException;

}
