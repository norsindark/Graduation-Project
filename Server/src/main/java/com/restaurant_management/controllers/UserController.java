package com.restaurant_management.controllers;

import com.restaurant_management.dtos.UserDto;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.PasswordRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/client/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Optional<User>> getUserByAccessToken() throws DataExitsException {
        return ResponseEntity.ok(this.userService.getUserByAccessToken());
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUser(
            @RequestBody UserDto userDto
    ) throws DataExitsException {
        return ResponseEntity.ok(this.userService.updateUserProfile(userDto));
    }

    @PutMapping("/update-avatar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateAvatar(
            @RequestParam("file") MultipartFile file
    ) throws DataExitsException, IOException {
        return ResponseEntity.ok(this.userService.updateAvatar(file));
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> changePassword(
            @RequestBody PasswordRequest request
    ) throws DataExitsException {
        return ResponseEntity.ok(this.userService.changePassword(request));
    }

    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(
            @PathVariable String userId
    ) throws DataExitsException {
        return ResponseEntity.ok(this.userService.deleteUser(userId));
    }
}
