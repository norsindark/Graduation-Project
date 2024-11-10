package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.UserMembershipDto;
import com.restaurant_management.dtos.UserMonthlySpecialDto;
import com.restaurant_management.dtos.UserWithoutOrdersProjectionDto;
import com.restaurant_management.entites.*;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.repositories.*;
import com.restaurant_management.services.interfaces.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@Component
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final DishOptionSelectionRepository dishOptionSelectionRepository;


    @Value("${RestaurantManagement.app.ClientUrl}")
    private String clientUrl;

    @Value("${RestaurantManagement.app.ServerUrl}")
    private String serverUrl;

    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void sendVerificationEmail(String email, String token)
            throws MessagingException, UnsupportedEncodingException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Please click this URL to verify your email";
        System.out.println("clientUrl: " + clientUrl);

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
        helper.setText(content.toString(), true);

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

    public void sendOfferNotification(Offer offer) throws MessagingException, UnsupportedEncodingException, DataExitsException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Exclusive Offer Just for You!";
        String forUser = "";

        switch (offer.getOfferType()) {
            case "FIRST_TIME_CUSTOMER_OFFER" -> {
                forUser = "First Time Order Customers";
            }
            case "MONTHLY_SPECIAL" -> {
                forUser = "Monthly Special Customers";
            }
            case "MEMBERSHIP" -> {
                forUser = "Membership Customers";
            }
        }

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

        StringBuilder content = new StringBuilder("<html><body style=\"font-family: Arial, sans-serif; color: #333;\">")
                .append("<div class=\"layout-content\" style=\"padding: 20px;\">")
                .append("<h2 style=\"color: #5C8E5F; font-size: 18px;\">")
                .append("Special Offer on ").append(offer.getDish().getDishName()).append(" for ").append(forUser).append("</h2>")
                .append("<p style=\"color: #5C8E5F; font-size: 14px;\">")
                .append("We're excited to bring you a special offer on ").append(offer.getDish().getDishName())
                .append(". Enjoy a discount of <strong style=\"text-transform: uppercase; font-weight: bold;\">")
                .append(offer.getDiscountPercentage()).append("% off!</strong></p>")
                .append("<table style=\"border-collapse: collapse; width: 100%; margin-top: 20px; border-radius: 8px; overflow: hidden;\">")
                .append("<thead>")
                .append("<tr style=\"background-color: #81c784;\">")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Dish Name</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Thumb Image</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Price</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Discount</th>")
                .append("</tr>")
                .append("</thead>")
                .append("<tbody>")
                .append("<tr style=\"background-color: #f0f4e8 ;\">")
                .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(offer.getDish().getDishName()).append("</td>")
                .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">")
                .append("<img src=\"").append(offer.getDish().getThumbImage()).append("\" alt=\"").append(offer.getDish().getDishName())
                .append("\" style=\"width: 100px; height: auto;\"/></td>")
                .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(currencyFormat.format(offer.getDish().getPrice())).append("</td>")
                .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(offer.getDiscountPercentage()).append("%</td>")
                .append("</tr>")
                .append("</tbody>")
                .append("</table>")


                .append("<a href=\"").append(clientUrl).append("product-detail/").append(offer.getDish().getSlug())
                .append("\" style=\"display: inline-block; background-color: #4CAF50; color: white; margin-top: 20px; padding: 10px 20px; text-align: center; border-radius: 5px; text-decoration: none;\">")
                .append("View Product Details</a>")

                .append("<p style=\"color: #5C8E5F;\">Thank you for choosing us! We hope you enjoy this offer.</p>")
                .append("</div></body></html>");

        List<?> users = checkCondition(offer.getOfferType());
        int count = 0;
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        if (users != null && !users.isEmpty()) {
            for (Object userObject : users) {
                if (count == 2) {
                    break;
                }
                if (userObject instanceof UserWithoutOrdersProjectionDto) {
                    UserWithoutOrdersProjectionDto user = (UserWithoutOrdersProjectionDto) userObject;
                    sendEmail(helper, fromAddress, senderName, user.getEmail(), subject, content);
                    count++;
                } else if (userObject instanceof UserMonthlySpecialDto) {
                    UserMonthlySpecialDto user = (UserMonthlySpecialDto) userObject;
                    sendEmail(helper, fromAddress, senderName, user.getEmail(), subject, content);
                    count++;
                } else if (userObject instanceof UserMembershipDto) {
                    UserMembershipDto user = (UserMembershipDto) userObject;
                    sendEmail(helper, fromAddress, senderName, user.getEmail(), subject, content);
                    count++;
                }
            }
        }
    }

    private void sendEmail(MimeMessageHelper helper, String fromAddress, String senderName, String toEmail, String subject, StringBuilder content) {
        try {
            helper.setFrom(fromAddress, senderName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content.toString(), true);
            javaMailSender.send(helper.getMimeMessage());
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private List<?> checkCondition(String offerType) {
        if (offerType == null) {
            return null;
        }

        return switch (offerType) {
            case "MONTHLY_SPECIAL" -> new ArrayList<>(userRepository.findUsersWithCreatedAtBefore(
                    Timestamp.valueOf(LocalDateTime.now().minusMonths(1))));
            case "MEMBERSHIP" -> new ArrayList<>(userRepository.findUsersWithCreatedAtBeforeYear(
                    Timestamp.valueOf(LocalDateTime.now().minusYears(1))));
            case "FIRST_TIME_CUSTOMER_OFFER" -> new ArrayList<>(userRepository.findUsersWithoutOrders());
            default -> null;
        };
    }

}
