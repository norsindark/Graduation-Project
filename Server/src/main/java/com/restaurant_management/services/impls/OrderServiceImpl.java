package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.OrderDto;
import com.restaurant_management.dtos.OrderItemDto;
import com.restaurant_management.entites.*;
import com.restaurant_management.enums.UnitType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OrderResponse;
import com.restaurant_management.repositories.*;
import com.restaurant_management.services.interfaces.OrderService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final DishRepository dishRepository;
    private final DishOptionSelectionRepository dishOptionSelectionRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final WarehouseRepository warehouseRepository;
    private final RecipeRepository recipeRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final JavaMailSender javaMailSender;
    private final OrderItemOptionRepository orderItemOptionRepository;
    private final PagedResourcesAssembler<OrderResponse> pagedResourcesAssembler;


    @Override
    @Transactional
    public PagedModel<EntityModel<OrderResponse>> getAllOrders(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Order> orders = orderRepository.findAll(pageable);
        if (orders.isEmpty()) {
            throw new DataExitsException("No orders found");
        }
        List<OrderResponse> orderResponses = orders.stream()
                .map(order -> {
                    Address address = addressRepository.findById(order.getAddressId())
                            .orElseThrow(() -> new RuntimeException("Address not found"));
                    List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                    return new OrderResponse(order, address, orderItems);
                })
                .collect(Collectors.toList());
        return pagedResourcesAssembler.toModel(new PageImpl<>(orderResponses, pageable, orders.getTotalElements()));
    }

    @Override
    @Transactional
    public ApiResponse addNewOrder(OrderDto request)
            throws DataExitsException, MessagingException, UnsupportedEncodingException {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataExitsException("User not found"));
        addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new DataExitsException("Address not found"));

        updateWarehouse(request);
        Order order = createNewOrder(request, user);
        addOrderItem(order, request);

        if (request.getCouponId() != null && !request.getCouponId().isEmpty()) {
            setCouponUsage(request);
        }

        sendEmailListOrderItems(
                user.getEmail(), request.getItems(),
                request.getCouponId(), order.getTotalPrice(),
                request.getPaymentMethod(), order.getStatus());

        return new ApiResponse("Order created successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateOrderStatus(String orderId, String status) throws DataExitsException, MessagingException, UnsupportedEncodingException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataExitsException("Order not found"));
        User user = order.getUser();
        order.setStatus(status.toUpperCase(Locale.ROOT));
        orderRepository.save(order);
        sendMailWhenUpdateOrderStatus(user.getEmail(), orderId, status);
        return new ApiResponse("Order updated successfully", HttpStatus.OK);
    }

    private Order createNewOrder(OrderDto request, User user) throws DataExitsException {
        Order order = Order.builder()
                .user(user)
                .addressId(request.getAddressId())
                .status("PENDING")
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .shippingFee(request.getShippingFee())
                .totalPrice(request.getTotalPrice())
                .build();
        orderRepository.save(order);
        return order;
    }

    private void addOrderItem(Order order, OrderDto request) throws DataExitsException {
        for (OrderItemDto orderItemDto : request.getItems()) {
            if (orderItemDto.getQuantity() <= 0) {
                throw new DataExitsException("Quantity must be greater than zero");
            }

            Dish dish = dishRepository.findById(orderItemDto.getDishId())
                    .orElseThrow(() -> new DataExitsException("Dish not found"));

            double totalAdditionalPrice = orderItemDto.getDishOptionSelectionIds().stream()
                    .map(dishOptionSelectionId -> dishOptionSelectionRepository.findById(dishOptionSelectionId)
                            .orElseThrow(() -> new RuntimeException("Dish option selection not found")))
                    .mapToDouble(DishOptionSelection::getAdditionalPrice)
                    .sum();

            double totalPrice = (dish.getPrice() * orderItemDto.getQuantity()) + totalAdditionalPrice;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .dish(dish)
                    .quantity(orderItemDto.getQuantity())
                    .price(dish.getPrice())
                    .totalPrice(totalPrice)
                    .options(new ArrayList<>())
                    .build();

            orderItem = orderItemRepository.save(orderItem);

            for (String optionId : orderItemDto.getDishOptionSelectionIds()) {
                DishOptionSelection dishOptionSelection = dishOptionSelectionRepository.findById(optionId)
                        .orElseThrow(() -> new DataExitsException("Dish option selection not found"));
                OrderItemOption orderItemOption = OrderItemOption.builder()
                        .orderItem(orderItem)
                        .additionalPrice(dishOptionSelection.getAdditionalPrice())
                        .dishOptionSelection(dishOptionSelection)
                        .build();

                orderItemOptionRepository.save(orderItemOption);
                orderItem.getOptions().add(orderItemOption);
            }
        }
    }

    private double totalOrderPrice(OrderDto request) throws DataExitsException {
        double total = 0;
        for (OrderItemDto orderItemDto : request.getItems()) {
            Dish dish = dishRepository.findById(orderItemDto.getDishId())
                    .orElseThrow(() -> new DataExitsException("Dish not found"));

            double basePrice = dish.getPrice() * orderItemDto.getQuantity();
            double totalAdditionalPrice = orderItemDto.getDishOptionSelectionIds().stream()
                    .map(dishOptionSelectionId -> dishOptionSelectionRepository.findById(dishOptionSelectionId)
                            .orElseThrow(() -> new RuntimeException("Dish option selection not found")))
                    .mapToDouble(DishOptionSelection::getAdditionalPrice)
                    .sum();

            total += basePrice + totalAdditionalPrice;
        }
        return total;
    }


    private void setCouponUsage(OrderDto request) throws DataExitsException {
        Coupon coupon = couponRepository.findById(request.getCouponId())
                .orElseThrow(() -> new DataExitsException("Coupon not found"));

        if (coupon.getQuantity() <= 0) {
            throw new IllegalStateException("Coupon has run out of stock");
        }

        if (LocalDate.now().isBefore(LocalDate.parse(coupon.getStartDate()))) {
            throw new IllegalStateException("Coupon is not valid yet");
        }

        if (LocalDate.now().isAfter(LocalDate.parse(coupon.getExpirationDate()))) {
            throw new IllegalStateException("Coupon has expired");
        }

        if (couponUsageRepository.existsByCouponIdAndUserId(coupon.getId(), request.getUserId())) {
            throw new IllegalStateException("Coupon has already been used by this user");
        }
        CouponUsage couponUsage = CouponUsage.builder()
                .couponId(request.getCouponId())
                .userId(request.getUserId())
                .build();

        coupon.setQuantity(coupon.getQuantity() - 1);
        couponRepository.save(coupon);
        couponUsageRepository.save(couponUsage);
    }

    @Transactional
    private void updateWarehouse(OrderDto request) {
        for (OrderItemDto orderItemDto : request.getItems()) {
            dishRepository.findById(orderItemDto.getDishId())
                    .ifPresentOrElse(dish -> {
                        List<Recipe> recipes = recipeRepository.findByDish(dish);

                        for (Recipe recipe : recipes) {
                            warehouseRepository.findById(recipe.getWarehouse().getId())
                                    .ifPresentOrElse(warehouse -> {
                                        UnitType recipeUnit = UnitType.fromString(recipe.getUnit());
                                        UnitType warehouseUnit = UnitType.fromString(warehouse.getUnit());

                                        double quantityUsed = UnitType.convert(
                                                recipe.getQuantityUsed() * orderItemDto.getQuantity(),
                                                recipeUnit, warehouseUnit
                                        );

                                        double newAvailableQuantity = warehouse.getAvailableQuantity() - quantityUsed;
                                        double newQuantityUsed = warehouse.getQuantityUsed() + quantityUsed;

                                        if (newAvailableQuantity < 0) {
                                            throw new IllegalStateException("Not enough stock in warehouse for item: " + dish.getDishName());
                                        }

                                        warehouse.setAvailableQuantity(newAvailableQuantity);
                                        warehouse.setQuantityUsed(newQuantityUsed);

                                        warehouseRepository.save(warehouse);
                                    }, () -> {
                                        throw new IllegalStateException("Warehouse not found for recipe: " + recipe.getId());
                                    });
                        }
                    }, () -> {
                        throw new IllegalStateException("Dish not found: " + orderItemDto.getDishId());
                    });
        }
    }

    private void sendEmailListOrderItems(String email, List<OrderItemDto> items, String couponId, Double totalPrice, String paymentMethod, String status)
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

        Coupon coupon = null;
        if (couponId != null) {
            coupon = couponRepository.findById(couponId)
                    .orElseThrow(() -> new DataExitsException("Coupon not found"));
        }

        for (OrderItemDto item : items) {
            Dish dish = dishRepository.findById(item.getDishId())
                    .orElseThrow(() -> new DataExitsException("Dish not found"));

            List<DishOptionSelection> selectedOptions = new ArrayList<>();
            for (String optionId : item.getDishOptionSelectionIds()) {
                DishOptionSelection option = dishOptionSelectionRepository.findById(optionId)
                        .orElseThrow(() -> new DataExitsException("Dish option selection not found"));
                selectedOptions.add(option);
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
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(dish.getPrice()).append(" VND</td>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(item.getQuantity()).append("</td>")
                    .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(options.toString()).append(" VND</td>")
                    .append("</tr>");
        }


        content.append("</tbody>")
                .append("</table>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Coupon Code: ").append(coupon != null ? coupon.getCode() : "N/A").append("</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Payment Method: ").append(paymentMethod).append("</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Order Status: ").append(status).append("</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #333;\">")
                .append("Total Price: $").append(totalPrice).append("</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("We will notify you when your order is on its way.</p>")
                .append("<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                .append("Thank you for choosing us!</p>")
                .append("</body></html>");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        javaMailSender.send(message);
    }

    private void sendMailWhenUpdateOrderStatus(String email, String orderId, String status) throws MessagingException, UnsupportedEncodingException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Order Status Update";
        String content = "<html><body>" +
                "<h2 style=\"color: #13b3e6; font-family: Arial, sans-serif; font-size: 18px;\">" +
                "Your Order Status has been Updated!</h2>" +
                "<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">" +
                "Order ID: " + orderId + "</p>" +
                "<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">" +
                "New Status: " + status + "</p>" +
                "<p style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">" +
                "Thank you for your patience!</p>" +
                "</body></html>";

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content, true);

        javaMailSender.send(message);
    }

}
