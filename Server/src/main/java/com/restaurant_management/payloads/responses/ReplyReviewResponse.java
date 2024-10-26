package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Review;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReplyReviewResponse {
    private String reviewId;
    private int rating;
    private String comment;
    private String userFullName;
    private List<ReplyReviewResponse> replies;
    private String createdAt;

    public ReplyReviewResponse(Review review) {
        this.reviewId = review.getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.userFullName = review.getUser().getFullName();
        this.createdAt = review.getCreatedAt().toString();

        this.replies = review.getReplies() != null ?
                review.getReplies().stream()
                        .map(ReplyReviewResponse::new)
                        .collect(Collectors.toList()) : null;
    }
}