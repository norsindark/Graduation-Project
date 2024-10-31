package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Offer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {
    private String id;
    private String offerType;
    private DishResponse dish;
    private String dishName;
    private LocalDate startDate;
    private LocalDate endDate;
    private int discountPercentage;

    public OfferResponse(Offer offer) {
        this.id = offer.getId();
        this.offerType = offer.getOfferType();
        this.dish = new DishResponse(offer.getDish());
        this.startDate = offer.getStartDate();
        this.endDate = offer.getEndDate();
        this.discountPercentage = offer.getDiscountPercentage();
    }
}
