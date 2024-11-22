package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentReplyResponse {
    private String commentId;
    private String content;
    private String author;

    public CommentReplyResponse(Comment comment) {
        this.commentId = comment.getId();
        this.content = comment.getContent();
        this.author = comment.getAuthor().getUsername();
    }
}