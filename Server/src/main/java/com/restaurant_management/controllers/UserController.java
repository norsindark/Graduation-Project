package com.restaurant_management.controllers;

import com.restaurant_management.dtos.ReviewDto;
import com.restaurant_management.dtos.UserDto;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.PasswordRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.ReviewService;
import com.restaurant_management.services.interfaces.UserService;
import com.restaurant_management.utils.CookieUtils;
import com.restaurant_management.utils.GetUserUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Tag(name = "User")
@RequestMapping("/api/v1/client")
public class UserController {

    private final UserService userService;

    private final UserRepository userRepository;

    private final ReviewService reviewService;

    @GetMapping("/user/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<Optional<UserResponse>> getUserByAccessToken() throws DataExitsException {
        return ResponseEntity.ok(this.userService.getUserByAccessToken());
    }

    @PutMapping("/user/update")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUser(
            @RequestBody UserDto userDto
    ) throws DataExitsException {
        return ResponseEntity.ok(this.userService.updateUserProfile(userDto));
    }

    @PutMapping("/user/update-avatar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateAvatar(
            @RequestParam("file") MultipartFile file
    ) throws DataExitsException, IOException {
        return ResponseEntity.ok(this.userService.updateAvatar(file));
    }

    @PutMapping("/user/change-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> changePassword(
            @RequestBody PasswordRequest request
    ) throws DataExitsException {
        return ResponseEntity.ok(this.userService.changePassword(request));
    }

    @DeleteMapping("/user/delete/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(
            @PathVariable String userId
    ) throws DataExitsException {
        return ResponseEntity.ok(this.userService.deleteUser(userId));
    }

    @GetMapping("/user/logout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<Void> logOut(HttpServletResponse response) throws DataExitsException {
        GetUserUtil getUserUtil = new GetUserUtil();
        String userEmail = getUserUtil.getUserEmail();
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            throw new DataExitsException("User not login!");
        }
        CookieUtils.addRefreshTokenCookie(response, null,0);
        return ResponseEntity.ok().build();
    }

    // reviews
    @PostMapping("/review/create-review")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN') || hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse> createReview(@RequestBody ReviewDto reviewDto) throws DataExitsException {
        return ResponseEntity.ok(reviewService.createReview(reviewDto));
    }

    @PutMapping("/review/update-review")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN') || hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse> updateReview(@RequestBody ReviewDto reviewDto)
            throws DataExitsException {
        return ResponseEntity.ok(reviewService.updateReview(reviewDto));
    }

    @PostMapping("/review/reply-review")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN') || hasRole('EMPLOYEE')")
    public ResponseEntity<ApiResponse> replyReview(@RequestBody ReviewDto reviewDto)
            throws DataExitsException {
        return ResponseEntity.ok(reviewService.replyReview(reviewDto));
    }

    @GetMapping("/review/get-all-reviews-by-user-id")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN') || hasRole('EMPLOYEE')")
    public ResponseEntity<?> getAllReviewsByUserId(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(reviewService.getAllReviewsByUserId(userId, pageNo, pageSize, sortBy, sortDir));
    }
}
