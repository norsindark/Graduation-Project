package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetUserResponse;
import com.restaurant_management.payloads.responses.OrderResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import com.restaurant_management.services.interfaces.AdminService;
import com.restaurant_management.services.interfaces.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Admin")
@RequestMapping("/api/v1/dashboard")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    @PostMapping("/user/add-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addNewUser(@Valid @RequestBody SignUpRequest signUpRequest) throws DataExitsException {
        return ResponseEntity.ok(adminService.addNewUser(signUpRequest));
    }

    @GetMapping("/user/get-user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Optional<UserResponse>> getUser(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @GetMapping("/user/get-all-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<GetUserResponse>>>
    getAllUsers(@RequestParam(defaultValue = "0") int pageNo,
                @RequestParam(defaultValue = "10") int pageSize,
                @RequestParam(defaultValue = "email") String sortBy,
                @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(adminService.getAllUsers(pageNo, pageSize, sortBy, sortDir));
    }

    @PutMapping("/user/update-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUser(@Valid @RequestBody UserRequest userRequest) throws DataExitsException {
        return ResponseEntity.ok(adminService.updateUser(userRequest));
    }

    @DeleteMapping("/user/delete-user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }

    @GetMapping("/user/search-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<GetUserResponse>>>
    searchUsers(@RequestParam(defaultValue = "role") String type,
                @RequestParam(defaultValue = "user") String keyword,
                @RequestParam(defaultValue = "0") int pageNo,
                @RequestParam(defaultValue = "10") int pageSize,
                @RequestParam(defaultValue = "email") String sortBy,
                @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException, ParseException {
        return ResponseEntity.ok(adminService.searchUsers(type, keyword, pageNo, pageSize, sortBy, sortDir));
    }


    // orders
    @GetMapping("order/get-all-orders")
    @Operation(summary = "get all orders", tags = {"Order"})
    public ResponseEntity<PagedModel<EntityModel<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(orderService.getAllOrders(pageNo, pageSize, sortBy, sortDir));
    }

    @PutMapping("/order/update-order-status")
    @Operation(summary = "update order status", tags = {"Order"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateOrderStatus(@RequestParam String orderId, @RequestParam String status)
            throws DataExitsException, MessagingException, UnsupportedEncodingException {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
