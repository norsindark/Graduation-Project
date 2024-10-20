package com.restaurant_management.services.interfaces;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

public interface PaymentService {
    String createPaymentUrl(HttpServletRequest request, HttpSession session) throws NoSuchAlgorithmException, UnsupportedEncodingException;

    String paymentReturn(Map<String, String> params, HttpSession session) throws NoSuchAlgorithmException;
}
