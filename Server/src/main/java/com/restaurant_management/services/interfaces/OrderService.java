package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.OrderDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OrderResponse;
import jakarta.mail.MessagingException;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.io.UnsupportedEncodingException;

public interface OrderService {
    PagedModel<EntityModel<OrderResponse>> getAllOrders(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    ApiResponse addNewOrder(OrderDto request)
            throws DataExitsException, MessagingException, UnsupportedEncodingException;

    ApiResponse updateOrderStatus(String orderId, String status) throws DataExitsException, MessagingException, UnsupportedEncodingException;
}
