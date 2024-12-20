package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Review;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private String reviewId;
    private Double rating;
    private String comment;
    private String dishId;
    private String dishName;
    private String userId;
    private String userFullName;
    private String userAvatar;
    private List<ReplyReviewResponse> replies;
    private String createdAt;

    public ReviewResponse(Review review) {
        this.reviewId = review.getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.dishId = review.getDish().getId();
        this.dishName = review.getDish().getDishName();
        this.userId = review.getUser().getId();
        this.userFullName = review.getUser().getFullName();
        this.userAvatar = review.getUser().getAvatar();
        this.createdAt = review.getCreatedAt().toString();

        this.replies = review.getReplies() != null ?
                review.getReplies().stream()
                        .filter(reply -> !reply.getId().equals(this.reviewId))
                        .map(ReplyReviewResponse::new)
                        .collect(Collectors.toList()) : null;
    }

    public ReviewResponse(String reviewId, Double rating, String comment, String dishId,
                          String dishName, String userId, String userFullName,
                          String userAvatar, Timestamp createdAt) {
        this.reviewId = reviewId;
        this.rating = rating;
        this.comment = comment;
        this.dishId = dishId;
        this.dishName = dishName;
        this.userId = userId;
        this.userFullName = userFullName;
        this.userAvatar = userAvatar;
        this.createdAt = createdAt.toString();
    }

}
