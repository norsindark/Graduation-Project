package com.restaurant_management.services.interfaces;

import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;


public interface EmailService {

    public void sendVerificationEmail(String to, String token) throws MessagingException, UnsupportedEncodingException;

    public void sendPasswordResetEmail(String email, String token) throws MessagingException, UnsupportedEncodingException;
}
