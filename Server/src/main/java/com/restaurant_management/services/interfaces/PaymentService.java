package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

public interface PaymentService {
    String createPaymentUrl(HttpServletRequest request, HttpSession session, String orderId);

    ApiResponse paymentReturn(Map<String, String> params, HttpSession session)
            throws NoSuchAlgorithmException, UnsupportedEncodingException, MessagingException, DataExitsException;
}
