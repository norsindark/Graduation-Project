package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment API")
@RequestMapping("/api/v1/client/payment")
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/create-payment-url")
    public ResponseEntity<String> createPaymentUrl(HttpServletRequest req, HttpSession session, @RequestParam String orderId) {
        return ResponseEntity.ok(paymentService.createPaymentUrl(req, session, orderId));
    }

    @GetMapping("/return")
    public ResponseEntity<ApiResponse> returnPayment(@RequestParam Map<String, String> params, HttpSession session)
            throws NoSuchAlgorithmException, UnsupportedEncodingException, MessagingException, DataExitsException {
        return ResponseEntity.ok(paymentService.paymentReturn(params, session));
    }
}
