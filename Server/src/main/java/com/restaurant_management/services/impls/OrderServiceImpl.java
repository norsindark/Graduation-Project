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
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
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
    private final OfferRepository offerRepository;
    private final PagedResourcesAssembler<OrderResponse> pagedResourcesAssembler;

    @Override
    @Transactional
    public PagedModel<EntityModel<OrderResponse>> getAllOrdersByUserId(
            String userId, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataExitsException("User not found"));
        Page<Order> orders = orderRepository.findByUser(user, pageable);
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
        order.setTotalPrice(totalOrderPrice(request));
        orderRepository.save(order);
        addOrderItem(order, request);

        if (request.getCouponId() != null && !request.getCouponId().isEmpty()) {
            setCouponUsage(request);
            order.setTotalPrice(applyCoupon(request));
            orderRepository.save(order);
        }

        sendEmailListOrderItems(
                user.getEmail(), request.getItems(),
                request.getCouponId(), order.getTotalPrice(),
                request.getPaymentMethod(), order.getStatus(),
                request.getShippingFee());

        return new ApiResponse(order.getId(), HttpStatus.CREATED);
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
                .createdAt(LocalDateTime.now())
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

            double totalAdditionalPrice = orderItemDto.getDishOptionSelectionIds() != null && !orderItemDto.getDishOptionSelectionIds().isEmpty()
                    ? orderItemDto.getDishOptionSelectionIds().stream()
                    .map(dishOptionSelectionId -> dishOptionSelectionRepository.findById(dishOptionSelectionId)
                            .orElseThrow(() -> new RuntimeException("Dish option selection not found")))
                    .mapToDouble(DishOptionSelection::getAdditionalPrice)
                    .sum()
                    : 0;

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

            if (orderItemDto.getDishOptionSelectionIds() != null && !orderItemDto.getDishOptionSelectionIds().isEmpty()) {
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
    }

    private double calculatePriceWithOffer(Dish dish, double basePrice, int quantity) throws DataExitsException {
        List<Offer> offers = offerRepository.findAllByDish(dish);
        LocalDate today = LocalDate.now();

        Offer activeOffer = offers.stream()
                .filter(offer -> !offer.getStartDate().isAfter(today) && !offer.getEndDate().isBefore(today)
                        && offer.getAvailableQuantityOffer() >= quantity)
                .findFirst()
                .orElse(null);

        if (activeOffer != null) {
            double discountAmount = (basePrice * activeOffer.getDiscountPercentage()) / 100;
            double discountedPrice = basePrice - discountAmount;

            activeOffer.setAvailableQuantityOffer(activeOffer.getAvailableQuantityOffer() - quantity);
            offerRepository.save(activeOffer);

            return discountedPrice;
        }
        return basePrice;
    }

    private double totalOrderPrice(OrderDto request) throws DataExitsException {
        double total = 0;

        for (OrderItemDto orderItemDto : request.getItems()) {
            Dish dish = dishRepository.findById(orderItemDto.getDishId())
                    .orElseThrow(() -> new DataExitsException("Dish not found"));

            double basePrice = calculatePriceWithOffer(dish,
                    dish.getOfferPrice() != null ? dish.getOfferPrice() : dish.getPrice(),
                    orderItemDto.getQuantity());

            double totalAdditionalPrice = orderItemDto.getDishOptionSelectionIds() != null && !orderItemDto.getDishOptionSelectionIds().isEmpty()
                    ? orderItemDto.getDishOptionSelectionIds().stream()
                    .map(dishOptionSelectionId -> dishOptionSelectionRepository.findById(dishOptionSelectionId)
                            .orElseThrow(() -> new RuntimeException("Dish option selection not found")))
                    .mapToDouble(DishOptionSelection::getAdditionalPrice)
                    .sum()
                    : 0;

            total += (basePrice + totalAdditionalPrice) * orderItemDto.getQuantity();
        }
        return total + (request.getShippingFee() != null ? request.getShippingFee() : 0.0);
    }

    private double applyCoupon(OrderDto request) throws DataExitsException {
        Coupon coupon = couponRepository.findById(request.getCouponId())
                .orElseThrow(() -> new DataExitsException("Coupon not found"));

        double totalPrice = totalOrderPrice(request);

        if (coupon.getMinOrderValue() != null && totalPrice < coupon.getMinOrderValue()) {
            throw new IllegalStateException("Order value does not meet the minimum requirement for the coupon");
        }

        double discount = 0;
        if (coupon.getDiscountPercent() != null) {
            discount = totalPrice * (coupon.getDiscountPercent() / 100);
            if (coupon.getMaxDiscount() != null && discount > coupon.getMaxDiscount()) {
                discount = coupon.getMaxDiscount();
            }
        }
        return totalPrice - discount;
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

    @Override
    @Transactional
    public ApiResponse cancelOrder(String orderId) throws
            DataExitsException, MessagingException, UnsupportedEncodingException  {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataExitsException("Order not found"));

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Order can only be canceled if it is in PENDING status");
        }

        returnIngredientsToWarehouse(order);

        order.setStatus("CANCELED");
        orderRepository.save(order);

        sendMailWhenUpdateOrderStatus(order.getUser().getEmail(), orderId, "CANCELED");

        return new ApiResponse("Order has been successfully canceled", HttpStatus.OK);
    }

    private void returnIngredientsToWarehouse(Order order) throws DataExitsException {
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        for (OrderItem orderItem : orderItems) {
            Dish dish = orderItem.getDish();
            List<Recipe> recipes = recipeRepository.findByDish(dish);

            for (Recipe recipe : recipes) {
                warehouseRepository.findById(recipe.getWarehouse().getId())
                        .ifPresentOrElse(warehouse -> {
                            UnitType recipeUnit = UnitType.fromString(recipe.getUnit());
                            UnitType warehouseUnit = UnitType.fromString(warehouse.getUnit());

                            double quantityToReturn = UnitType.convert(
                                    recipe.getQuantityUsed() * orderItem.getQuantity(),
                                    recipeUnit, warehouseUnit
                            );

                            warehouse.setAvailableQuantity(warehouse.getAvailableQuantity() + quantityToReturn);
                            warehouse.setQuantityUsed(warehouse.getQuantityUsed() - quantityToReturn);

                            warehouseRepository.save(warehouse);
                        }, () -> {
                            throw new IllegalStateException("Warehouse not found for recipe: " + recipe.getId());
                        });
            }
        }
    }

    @Override
    public Map<String, Long> getDishSalesStatistics() {
        List<Map<String, Long>> results = orderItemRepository.getDishSalesStatistics();

        Map<String, Long> dishSalesStatistics = new HashMap<>();
        for (Map<String, Long> result : results) {
            dishSalesStatistics.put(String.valueOf(result.get("dishName")), result.get("totalQuantity"));
        }

        return dishSalesStatistics;
    }

    @Override
    public Map<String, Map<String, Map<String, Double>>> getDishSalesRevenueAndProfitByMonth() {
        List<Map<String, Object>> monthlyRevenueResults = orderItemRepository.getDishSalesRevenueByMonth();
        System.out.println(monthlyRevenueResults);
        List<Recipe> recipes = recipeRepository.findAll();

        Map<String, Map<String, Map<String, Double>>> dishStatisticsByMonth = new HashMap<>();

        for (Recipe recipe : recipes) {
            Dish dish = recipe.getDish();
            Warehouse warehouse = recipe.getWarehouse();
            Double quantityUsed = recipe.getQuantityUsed();
            String recipeUnit = recipe.getUnit();
            String warehouseUnit = warehouse.getUnit();

            double convertedQuantityUsed = UnitType.convert(quantityUsed, UnitType.fromString(recipeUnit), UnitType.fromString(warehouseUnit));
            double costPerUnit = warehouse.getImportedPrice();

            String dishName = dish.getDishName();

            monthlyRevenueResults.stream()
                    .filter(result -> result.get("dishName").equals(dishName))
                    .forEach(result -> {
                        int month = (int) result.get("month");
                        int year = (int) result.get("year");
                        double revenue = (double) result.get("totalRevenue");

                        Long totalQuantitySold = (Long) result.get("totalQuantitySold");
                        int totalQuantitySoldInt = totalQuantitySold != null ? totalQuantitySold.intValue() : 0;

                        double updatedCost = costPerUnit * totalQuantitySoldInt * (convertedQuantityUsed / warehouse.getImportedQuantity());

                        double profit = revenue - updatedCost;

                        Map<String, Double> stats = new HashMap<>();
                        stats.put("totalRevenue", revenue);
                        stats.put("totalCost", updatedCost);
                        stats.put("profit", profit);

                        String monthKey = month + "-" + year;

                        dishStatisticsByMonth
                                .computeIfAbsent(monthKey, k -> new HashMap<>())
                                .put(dish.getDishName(), stats);
                    });
        }

        return dishStatisticsByMonth;
    }


    @Override
    public Map<String, Map<String, Map<String, Double>>> getDishSalesRevenueAndProfitByWeek() {
        List<Map<String, Object>> weeklyRevenueResults = orderItemRepository.getDishSalesRevenueByWeek();
        List<Recipe> recipes = recipeRepository.findAll();

        Map<String, Map<String, Map<String, Double>>> dishStatisticsByWeek = new HashMap<>();

        for (Recipe recipe : recipes) {
            Dish dish = recipe.getDish();
            Warehouse warehouse = recipe.getWarehouse();
            Double quantityUsed = recipe.getQuantityUsed();
            String recipeUnit = recipe.getUnit();
            String warehouseUnit = warehouse.getUnit();

            double convertedQuantityUsed = UnitType.convert(quantityUsed, UnitType.fromString(recipeUnit), UnitType.fromString(warehouseUnit));
            double costPerUnit = warehouse.getImportedPrice();

            String dishName = dish.getDishName();

            weeklyRevenueResults.stream()
                    .filter(result -> result.get("dishName").equals(dishName))
                    .forEach(result -> {
                        int week = (int) result.get("week");
                        int year = (int) result.get("year");
                        double revenue = (double) result.get("totalRevenue");

                        Long totalQuantitySold = (Long) result.get("totalQuantitySold");
                        int totalQuantitySoldInt = totalQuantitySold != null ? totalQuantitySold.intValue() : 0;

                        double updatedCost = costPerUnit * totalQuantitySoldInt * (convertedQuantityUsed / warehouse.getImportedQuantity());

                        double profit = revenue - updatedCost;

                        Map<String, Double> stats = new HashMap<>();
                        stats.put("totalRevenue", revenue);
                        stats.put("totalCost", updatedCost);
                        stats.put("profit", profit);

                        String weekKey = "W" + week + "-" + year;

                        dishStatisticsByWeek
                                .computeIfAbsent(weekKey, k -> new HashMap<>())
                                .put(dish.getDishName(), stats);
                    });
        }

        return dishStatisticsByWeek;
    }


    @Override
    public Map<String, Map<String, Double>> getDishSalesRevenueAndProfit() {
        List<Recipe> recipes = recipeRepository.findAll();

        Map<String, Double> dishTotalRevenue = new HashMap<>();
        Map<String, Double> dishTotalCost = new HashMap<>();

        for (Recipe recipe : recipes) {
            Dish dish = recipe.getDish();
            Warehouse warehouse = recipe.getWarehouse();
            Double quantityUsed = recipe.getQuantityUsed();
            String recipeUnit = recipe.getUnit();
            String warehouseUnit = warehouse.getUnit();

            double convertedQuantityUsed = UnitType.convert(quantityUsed, UnitType.fromString(recipeUnit), UnitType.fromString(warehouseUnit));

            double costPerUnit = warehouse.getImportedPrice();

            double cost = costPerUnit * (convertedQuantityUsed / warehouse.getImportedQuantity());

            List<Map<String, Double>> revenueResults = orderItemRepository.getDishSalesRevenue();
            for (Map<String, Double> result : revenueResults) {
                String dishName = String.valueOf(result.get("dishName"));
                if (dishName.equals(dish.getDishName())) {
                    double revenue = (Double) result.get("totalRevenue");
                    dishTotalRevenue.put(dishName, revenue);
                }
            }

            dishTotalCost.put(dish.getDishName(), cost);
        }

        Map<String, Map<String, Double>> dishStatistics = new HashMap<>();
        for (String dishName : dishTotalRevenue.keySet()) {
            double revenue = dishTotalRevenue.get(dishName);
            double cost = dishTotalCost.getOrDefault(dishName, 0.0);
            double profit = revenue - cost;

            Map<String, Double> stats = new HashMap<>();
            stats.put("totalRevenue", revenue);
            stats.put("totalCost", cost);
            stats.put("profit", profit);

            dishStatistics.put(dishName, stats);
        }

        return dishStatistics;
    }

    private void sendEmailListOrderItems(String email, List<OrderItemDto> items, String couponId, Double totalPrice, String paymentMethod, String status, Double shippingFee)
            throws MessagingException, UnsupportedEncodingException, DataExitsException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Your Order has been Placed Successfully";

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

        StringBuilder content = new StringBuilder("<html><body style=\"font-family: Arial, sans-serif; color: #333;\">")
                .append("<div class=\"layout-content\" style=\"padding: 20px;\">")
                .append("<h2 style=\"color: #5C8E5F; font-size: 18px;\">Your order has been placed successfully!</h2>")
                .append("<p style=\"color: #5C8E5F; font-size: 14px;\">Here is the list of items you have ordered:</p>")
                .append("<table style=\"border-collapse: collapse; width: 100%; margin-top: 20px; border-radius: 8px; overflow: hidden;\">")
                .append("<thead>")
                .append("<tr style=\"background-color: #81c784;\">")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Dish Name</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Thumb Image</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Price</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Selected Options</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Quantity</th>")
                .append("<th style=\"border: 1px solid #FFFFFF; padding: 8px; color: #FFFFFF;\">Total Price</th>")
                .append("</tr>")
                .append("</thead>")
                .append("<tbody>");

        Coupon coupon = null;
        if (couponId != null) {
            coupon = couponRepository.findById(couponId)
                    .orElseThrow(() -> new DataExitsException("Coupon not found"));
        }

        int indexRow = 0;

        for (OrderItemDto item : items) {
            Dish dish = dishRepository.findById(item.getDishId())
                    .orElseThrow(() -> new DataExitsException("Dish not found"));

            double priceItem = (dish.getOfferPrice() != null) ? dish.getOfferPrice() : dish.getPrice();
            double totalOptionsPrice = 0.0;

            Offer offer = offerRepository.findByDishId(dish.getId())
                    .orElse(null);

            String priceItemDisplay = currencyFormat.format(priceItem);

            if (offer != null && offer.getAvailableQuantityOffer() >= item.getQuantity()) {
                int discountPercentage = offer.getDiscountPercentage();
                priceItemDisplay += " (" + discountPercentage + "% off daily offer)";
                priceItem = priceItem * (1 - (discountPercentage / 100.0));
            } else {
                priceItem = dish.getPrice();
            }

            List<DishOptionSelection> selectedOptions = new ArrayList<>();
            if (item.getDishOptionSelectionIds() != null) {
                for (String optionId : item.getDishOptionSelectionIds()) {
                    DishOptionSelection option = dishOptionSelectionRepository.findById(optionId)
                            .orElseThrow(() -> new DataExitsException("Dish option selection not found"));
                    selectedOptions.add(option);
                    totalOptionsPrice += option.getAdditionalPrice();
                }
            }

            StringBuilder options = new StringBuilder();
            for (DishOptionSelection option : selectedOptions) {
                options.append(option.getDishOption().getOptionName())
                        .append(" (").append(currencyFormat.format(option.getAdditionalPrice())).append(")").append("<br>");
            }

            double totalItemPrice = (priceItem + totalOptionsPrice) * item.getQuantity();

            String backgroundColor = (indexRow % 2 == 0) ? "#f0f4e8" : "#fff0e0";

            content.append("<tr style=\"background-color: " + backgroundColor + ";\">")
                    .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(dish.getDishName()).append("</td>")
                    .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">")
                    .append("<img src=\"").append(dish.getThumbImage()).append("\" alt=\"").append(dish.getDishName()).append("\" style=\"width: 100px; height: auto;\"/>")
                    .append("</td>")
                    .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(priceItemDisplay).append("</td>")
                    .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(options.toString()).append("</td>")
                    .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(item.getQuantity()).append("</td>")
                    .append("<td style=\"border: none; padding: 8px; color: #000000E0;\">").append(currencyFormat.format(totalItemPrice)).append("</td>")
                    .append("</tr>");

            indexRow++;
        }

        content.append("</tbody>")
                .append("</table>")
                .append("<p style=\"color: #5C8E5F;\">Coupon Code: <strong>").append(coupon != null ? coupon.getCode() : "N/A").append("</strong></p>")
                .append("<p style=\"color: #5C8E5F;\">Payment Method: <strong>").append(paymentMethod).append("</strong></p>")
                .append("<p style=\"color: #5C8E5F;\">Order Status: <strong>").append(status).append("</strong></p>")
                .append("<p style=\"color: #5C8E5F;\">Shipping Fee: <strong>").append(currencyFormat.format(shippingFee != null ? shippingFee : 0.0)).append("</strong></p>")
                .append("<p style=\"color: #5C8E5F; font-size: 16px;\">Total Price: <strong>").append(currencyFormat.format(totalPrice)).append("</strong></p>")
                .append("<p style=\"color: #5C8E5F;\">Your order will be processed soon.</p>")
                .append("<p style=\"color: #5C8E5F;\">We will notify you when your order is on its way.</p>")
                .append("<p style=\"color: #5C8E5F;\">Thank you for choosing us!</p>")
                .append("</div></body></html>");

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content.toString(), true);

        javaMailSender.send(message);
    }

    private void sendMailWhenUpdateOrderStatus(String email, String orderId, String status)
            throws MessagingException, UnsupportedEncodingException {
        String fromAddress = "dvan78281@gmail.com";
        String senderName = "Sync Food";
        String subject = "Update Order Status";
        String content = "<html><body style=\"font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;\">" +
                "<div style=\"max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);\">" +
                "<h2 style=\"color: #388e3c; font-size: 24px; font-weight: bold; text-align: center;\">YOUR ORDER STATUS HAS BEEN UPDATED!</h2>" +
                "<p style=\"font-size: 16px; color: #333; text-align: center;\">Order ID: <strong>" + orderId + "</strong></p>" +
                "<p style=\"font-size: 16px; color: #333; text-align: center;\">New Status: <strong>" + status + "</strong></p>" +
                "<p style=\"font-size: 14px; color: #555; text-align: center;\">Thank you for your patience and for choosing Sync Food!</p>" +
                "<hr style=\"border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;\">" +
                "<p style=\"font-size: 12px; color: #888; text-align: center;\">This is an automated message, please do not reply.</p>" +
                "</div>" +
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
