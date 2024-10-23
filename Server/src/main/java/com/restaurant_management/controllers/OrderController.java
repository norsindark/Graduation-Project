package com.restaurant_management.controllers;

import com.restaurant_management.dtos.OrderDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OrderResponse;
import com.restaurant_management.services.interfaces.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Order", description = "Order API")
@RequestMapping("/api/v1/client/order")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/get-all-orders")
    public ResponseEntity<PagedModel<EntityModel<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(orderService.getAllOrders(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-new-order")
    public ResponseEntity<ApiResponse> addNewOrder(@RequestBody OrderDto request)
            throws DataExitsException, MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(orderService.addNewOrder(request));
    }

    @PutMapping("/update-order-status")
    public ResponseEntity<ApiResponse> updateOrderStatus(@RequestParam String orderId, @RequestParam String status)
            throws DataExitsException, MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }


}
