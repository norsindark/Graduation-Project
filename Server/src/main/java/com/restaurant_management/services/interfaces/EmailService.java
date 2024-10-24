package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;


public interface EmailService {

    void sendVerificationEmail(String to, String token) throws MessagingException, UnsupportedEncodingException;

    void sendPasswordResetEmail(String email, String token) throws MessagingException, UnsupportedEncodingException;

    void sendEmailListOrderItems(String orderId)
            throws MessagingException, UnsupportedEncodingException, DataExitsException;
}
