package com.restaurant_management.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogDto {
    private String id;
    private String title;
    private String content;
    private String author;
    private String status;
}
