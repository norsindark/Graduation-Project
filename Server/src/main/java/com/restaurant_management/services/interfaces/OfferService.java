package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.OfferDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OfferResponse;
import org.springframework.hateoas.*;

import java.util.List;

public interface OfferService {
    OfferResponse getOfferById(String id) throws DataExitsException;
    PagedModel<EntityModel<OfferResponse>> getAllOffers(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    ApiResponse createOffer(OfferDto offerDto) throws DataExitsException;

    ApiResponse updateOffer(OfferDto offerDto) throws DataExitsException;

    ApiResponse deleteOffer(List<String> ids);
}
