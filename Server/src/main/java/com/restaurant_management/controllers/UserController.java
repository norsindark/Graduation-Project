package com.restaurant_management.controllers;

import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.UserNotFoundException;
import com.restaurant_management.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/client/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Optional<User>> getUserByAccessToken() throws UserNotFoundException {
        return ResponseEntity.ok(this.userService.getUserByAccessToken());
    }

//    @PutMapping("/update")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse> updateUser(
//            @RequestBody UserDto userDto
//    ) throws UserNotFoundException {
//        return ResponseEntity.ok(this.userService.updateUserProfile(userDto));
//    }
//
//    @PutMapping("/update-avatar")
//    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse> updateAvatar(
//            @RequestParam("file") MultipartFile file
//    ) throws UserNotFoundException, IOException {
//        return ResponseEntity.ok(this.userService.updateAvatar(file));
//    }
}
