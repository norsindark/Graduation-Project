package com.restaurant_management.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {
    public static void addRefreshTokenCookie(HttpServletResponse response, String refreshToken, int maxAgeInSeconds) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(maxAgeInSeconds);
        response.addCookie(refreshTokenCookie);
    }
}