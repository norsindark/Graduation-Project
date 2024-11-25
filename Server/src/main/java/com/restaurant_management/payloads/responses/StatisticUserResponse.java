package com.restaurant_management.payloads.responses;

import lombok.Data;

@Data
public class StatisticUserResponse {
    private Long totalUser;
    private Long userToday;
}
