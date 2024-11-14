package com.restaurant_management.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {
    private String content;
    private String author;
    private String status;
}
