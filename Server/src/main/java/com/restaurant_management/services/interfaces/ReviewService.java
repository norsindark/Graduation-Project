package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.ReviewDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.ReviewResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface ReviewService {
    PagedModel<EntityModel<ReviewResponse>> getAllReviewsByDishId(String dishId, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    PagedModel<EntityModel<ReviewResponse>> getAllReviews(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    PagedModel<EntityModel<ReviewResponse>> getAllReviewsByUserId(String userId, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse createReview(ReviewDto reviewDto) throws DataExitsException;

    ApiResponse updateReview(ReviewDto reviewDto) throws DataExitsException;

    ApiResponse deleteReview(String reviewId) throws DataExitsException;

    ApiResponse replyReview(ReviewDto reviewDto) throws DataExitsException;

    Double getAverageRatingByDishId(String dishId) throws DataExitsException;
}
