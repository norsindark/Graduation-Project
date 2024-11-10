package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.OfferDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OfferResponse;
import jakarta.mail.MessagingException;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface OfferService {
    OfferResponse getOfferById(String id) throws DataExitsException;
    PagedModel<EntityModel<OfferResponse>> getAllOffers(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    ApiResponse createOffers(List<OfferDto> offerDtos) throws DataExitsException, MessagingException, UnsupportedEncodingException;

    ApiResponse updateOffers(List<OfferDto> offerDtos) throws DataExitsException, MessagingException, UnsupportedEncodingException;

    ApiResponse deleteOffer(List<String> ids);
}
