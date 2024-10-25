package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.ReviewDto;
import com.restaurant_management.entites.*;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.ReviewResponse;
import com.restaurant_management.repositories.DishRepository;
import com.restaurant_management.repositories.OrderRepository;
import com.restaurant_management.repositories.ReviewRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final PagedResourcesAssembler<ReviewResponse> pagedResourcesAssembler;

    @Override
    public PagedModel<EntityModel<ReviewResponse>> getAllReviews(int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Review> pageResult = reviewRepository.findAll(pageable);

        if (pageResult.isEmpty()) {
            throw new DataExitsException("No reviews found");
        }

        List<ReviewResponse> reviewResponses = pageResult.stream()
                .filter(review -> review.getParentReview() == null)
                .map(ReviewResponse::new)
                .collect(Collectors.toList());

        return pagedResourcesAssembler.toModel(new PageImpl<>(reviewResponses, pageable, pageResult.getTotalElements()));
    }


    @Override
    public ApiResponse createReview(ReviewDto reviewDto) throws DataExitsException {
        Dish dish = dishRepository.findById(reviewDto.getDishId())
                .orElseThrow(() -> new DataExitsException("Dish not found"));
        User user = userRepository.findById(reviewDto.getUserId())
                .orElseThrow(() -> new DataExitsException("User not found"));

        if (!hasUserPurchasedDish(user.getId(), dish.getId())) {
            return new ApiResponse("You must purchase the dish before reviewing", HttpStatus.FORBIDDEN);
        }

        if (reviewDto.getRating() > 5 || reviewDto.getRating() < 1) {
            return new ApiResponse("Rating must be between 1 and 5", HttpStatus.BAD_REQUEST);
        }

        Review review = Review.builder()
                .rating(reviewDto.getRating())
                .comment(reviewDto.getReview())
                .dish(dish)
                .user(user)
                .build();

        reviewRepository.save(review);

        return new ApiResponse("Review created successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateReview(ReviewDto reviewDto) throws DataExitsException {
        Review review = reviewRepository.findById(reviewDto.getReviewId())
                .orElseThrow(() -> new DataExitsException("Review not found"));

        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getReview());

        reviewRepository.save(review);

        return new ApiResponse("Review updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteReview(String reviewId) throws DataExitsException {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new DataExitsException("Review not found"));

        reviewRepository.delete(review);

        return new ApiResponse("Review deleted successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse replyReview(ReviewDto reviewDto) throws DataExitsException {
        Review parentReview = reviewRepository.findById(reviewDto.getReviewId())
                .orElseThrow(() -> new DataExitsException("Review not found"));
        User user = userRepository.findById(reviewDto.getUserId())
                .orElseThrow(() -> new DataExitsException("User not found"));

        Review replyReview = Review.builder()
                .comment(reviewDto.getReview())
                .user(user)
                .parentReview(parentReview)
                .build();

        reviewRepository.save(replyReview);

        return new ApiResponse("Reply added successfully", HttpStatus.CREATED);
    }

    private boolean hasUserPurchasedDish(String userId, String dishId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                if (item.getDish().getId().equals(dishId)) {
                    return true;
                }
            }
        }

        return false;
    }

}
