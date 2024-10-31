package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfferDto {
    private String id;
    private String dishId;
    private String offerType;
    private LocalDate startDate;
    private LocalDate endDate;
    private int discountPercentage;
}
