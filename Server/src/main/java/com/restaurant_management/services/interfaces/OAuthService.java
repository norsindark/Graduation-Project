package com.restaurant_management.services.interfaces;

import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuthService {

    ApiResponse handleOAuth2Callback(OAuth2User oAuth2User);

}
