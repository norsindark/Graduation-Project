package com.restaurant_management.services.impls;

import com.restaurant_management.services.interfaces.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@Component
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

//    @Value("RestaurantManagement.app.ServerUrl")
    private final static String serverUrl = "http://localhost:8080/api/v1/auth/";

//    @Value("RestaurantManagement.app.ClientUrl")
    private final static  String clientUrl= "http://localhost:3000/";

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void sendVerificationEmail(String email, String token)
            throws MessagingException, UnsupportedEncodingException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Please click this URL to verify your email";

        String verificationUrl = clientUrl + "verify-email?token=" + token;

        StringBuilder content = new StringBuilder("<div style=\"text-align: center;\">")
                .append("<h2 style=\"color: #4CAF50; font-family: Arial, sans-serif;\">")
                .append("Email Verification</h2>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Please click the link below to verify your email address:</p>")
                .append("<h3><a href=\"").append(verificationUrl).append("\" target=\"_self\" style=\"text-decoration: none; background-color: #81c784; color: white; padding: 10px 15px; border-radius: 5px;\">")
                .append("VERIFY EMAIL</a></h3>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Thank you,<br>")
                .append("Sin Store.</p>")
                .append("</div>");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content.toString(), true); // Gửi nội dung HTML

        javaMailSender.send(message);
    }



    @Override
    public void sendPasswordResetEmail(String email, String token)
            throws MessagingException, UnsupportedEncodingException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Please click this URL to change your password";

        String changePasswordUrl = clientUrl + "reset-password?token=" + token;

        StringBuilder content = new StringBuilder("<div style=\"text-align: center;\">")
                .append("<h2 style=\"color: #4CAF50; font-family: Arial, sans-serif;\">")
                .append("Password Reset Request</h2>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Please click the link below to change your password:</p>")
                .append("<h3><a href=\"").append(changePasswordUrl).append("\" target=\"_self\" style=\"text-decoration: none; background-color: #81c784; color: white; padding: 10px 15px; border-radius: 5px;\">")
                .append("CHANGE PASSWORD</a></h3>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Thank you,<br>")
                .append("Sin Store.</p>")
                .append("</div>");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content.toString(), true); // Gửi nội dung HTML

        javaMailSender.send(message);
    }

}
