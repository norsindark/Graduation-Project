package com.restaurant_management.controllers;

import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/dashboard")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/user/add-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addNewUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.ok(adminService.addNewUser(signUpRequest));
    }

    @GetMapping("/user/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(@RequestParam int pageNo,
                                                          @RequestParam int pageSize) {
        return ResponseEntity.ok(adminService.getAllUsers(pageNo, pageSize));
    }

    @PutMapping("/user/update-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUser(@Valid @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(adminService.updateUser(userRequest));
    }

    @DeleteMapping("/user/delete-user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }
}