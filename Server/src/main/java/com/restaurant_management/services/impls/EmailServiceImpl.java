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
        String senderName = "Restaurant";
        String subject = "Please click this URL to verify your email";
        String content = "<br>"
                + "Please click the link below to verify your email address:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY EMAIL</a></h3>"
                + "Thank you,<br>"
                + "Sin Store.";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);

        String verificationUrl = serverUrl + "verify-email?token=" + token;
        content = content.replace("[[URL]]", verificationUrl);

        helper.setText(content, true);

        javaMailSender.send(message);
    }


    @Override
    public void sendPasswordResetEmail(String email, String token) throws MessagingException, UnsupportedEncodingException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Restaurant";
        String subject = "Please click this URL to change your password";

        String content = "<br>"
                + "Please click the link below to change your password:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">CHANGE PASSWORD</a></h3>"
                + "Thank you,<br>"
                + "Sin Store.";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);

        String changePasswordUrl = clientUrl + "reset-password?token=" + token;
        content = content.replace("[[URL]]", changePasswordUrl);

        helper.setText(content, true);

        javaMailSender.send(message);
    }
}
