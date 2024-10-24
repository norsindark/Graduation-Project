package com.restaurant_management.services.impls;

import com.restaurant_management.entites.*;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.repositories.DishOptionSelectionRepository;
import com.restaurant_management.repositories.DishRepository;
import com.restaurant_management.repositories.OrderItemRepository;
import com.restaurant_management.repositories.OrderRepository;
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
import java.util.ArrayList;
import java.util.List;

@Service
@Component
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final DishOptionSelectionRepository dishOptionSelectionRepository;


    @Value("RestaurantManagement.app.ServerUrl")
    private String serverUrl;

    @Value("RestaurantManagement.app.ClientUrl")
    private String clientUrl;

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


    @Override
    public void sendEmailListOrderItems(String orderId)
            throws MessagingException, UnsupportedEncodingException, DataExitsException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Your Order has been Placed Successfully";

        StringBuilder content = new StringBuilder("<html><body>")
                .append("<h2 style=\"color: #81c784; font-family: Arial, sans-serif; font-size: 18px;\">")
                .append("Your order has been placed successfully!</h2>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Here is the list of items you have ordered:</p>")
                .append("<table style=\"border-collapse: collapse; width: 100%;\">")
                .append("<thead>")
                .append("<tr style=\"background-color: #f2f2f2;\">")
                .append("<th style=\"border: 1px solid #ddd; padding: 8px;\">Dish Name</th>")
                .append("<th style=\"border: 1px solid #ddd; padding: 8px;\">Thumb Image</th>")
                .append("<th style=\"border: 1px solid #ddd; padding: 8px;\">Price</th>")
                .append("<th style=\"border: 1px solid #ddd; padding: 8px;\">Quantity</th>")
                .append("<th style=\"border: 1px solid #ddd; padding: 8px;\">Selected Options</th>")
                .append("</tr>")
                .append("</thead>")
                .append("<tbody>");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataExitsException("Order not found"));

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        for (OrderItem item : items) {
            Dish dish = dishRepository.findById(item.getDish().getId())
                    .orElseThrow(() -> new DataExitsException("Dish not found"));

            List<DishOptionSelection> selectedOptions = new ArrayList<>();
            for (OrderItemOption option : item.getOptions()) {
                if (option != null && option.getId() != null) {
                    DishOptionSelection optionSelection = dishOptionSelectionRepository.findById(option.getId())
                            .orElseThrow(() -> new DataExitsException("Dish option selection not found"));
                    selectedOptions.add(optionSelection);
                }
            }

            StringBuilder options = new StringBuilder();
            for (DishOptionSelection option : selectedOptions) {
                options.append(option.getDishOption().getOptionName())
                        .append(" (").append(option.getAdditionalPrice()).append(")").append("<br>");
            }

            content.append("<tr>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(dish.getDishName()).append("</td>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">")
                    .append("<img src=\"").append(dish.getThumbImage()).append("\" alt=\"").append(dish.getDishName()).append("\" style=\"width: 100px; height: auto;\"/>")
                    .append("</td>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">$").append(dish.getPrice()).append("</td>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(item.getQuantity()).append("</td>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(options.toString()).append("</td>")
                    .append("</tr>");
        }

        double totalPrice = order.getTotalPrice();

        content.append("</tbody>")
                .append("</table>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333;\">") // Tăng kích thước và in đậm
                .append("Total Price: $").append(totalPrice).append("</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("We will notify you when your order is on its way.</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Thank you for choosing us!</p>")
                .append("</body></html>");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(order.getUser().getEmail());
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        javaMailSender.send(message);
    }
}
