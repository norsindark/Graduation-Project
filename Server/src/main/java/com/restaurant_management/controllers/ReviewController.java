package com.restaurant_management.controllers;

import com.restaurant_management.dtos.ReviewDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.ReviewResponse;
import com.restaurant_management.services.interfaces.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Review", description = "Review API")
@RequestMapping("/api/v1/dashboard/review")
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/get-all-reviews-by-dish/{dishId}")
    public ResponseEntity<PagedModel<EntityModel<ReviewResponse>>> getAllReviewsByDishId(
            @RequestParam String dishId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(reviewService.getAllReviewsByDishId(dishId, pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-all-reviews")
    public ResponseEntity<PagedModel<EntityModel<ReviewResponse>>> getAllReviews(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(reviewService.getAllReviews(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/create-review")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createReview(@RequestBody ReviewDto reviewDto) throws DataExitsException {
        return ResponseEntity.ok(reviewService.createReview(reviewDto));
    }

    @PutMapping("/update-review")
    @PreAuthorize("hasRole('USER') || hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateReview(@RequestBody ReviewDto reviewDto)
            throws DataExitsException {
        return ResponseEntity.ok(reviewService.updateReview(reviewDto));
    }

    @DeleteMapping("/delete-review/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable String reviewId) throws DataExitsException {
        return ResponseEntity.ok(reviewService.deleteReview(reviewId));
    }

    @PostMapping("/reply-review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> replyReview(@RequestBody ReviewDto reviewDto)
            throws DataExitsException {
        return ResponseEntity.ok(reviewService.replyReview(reviewDto));
    }
}
