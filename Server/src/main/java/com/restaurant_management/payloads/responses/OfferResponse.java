package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Offer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {
    private String id;
    private String offerType;
    private int discountPercentage;
    private int availableQuantityOffer;
    private LocalDate startDate;
    private LocalDate endDate;
    private DishResponse dish;

    public OfferResponse(Offer offer) {
        this.id = offer.getId();
        this.offerType = offer.getOfferType();
        this.discountPercentage = offer.getDiscountPercentage();
        this.availableQuantityOffer = offer.getAvailableQuantityOffer();
        this.startDate = offer.getStartDate();
        this.endDate = offer.getEndDate();
        this.dish = new DishResponse(offer.getDish());
    }
}
