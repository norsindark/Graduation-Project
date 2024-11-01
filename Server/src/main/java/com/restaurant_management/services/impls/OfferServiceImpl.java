package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.OfferDto;
import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Offer;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OfferResponse;
import com.restaurant_management.repositories.DishRepository;
import com.restaurant_management.repositories.OfferRepository;
import com.restaurant_management.services.interfaces.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final DishRepository dishRepository;
    private final PagedResourcesAssembler<OfferResponse> pagedResourcesAssembler;

    @Override
    public OfferResponse getOfferById(String id) throws DataExitsException {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new DataExitsException("Offer not found"));
        return new OfferResponse(offer);
    }

    @Override
    public PagedModel<EntityModel<OfferResponse>> getAllOffers(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Offer> offers = offerRepository.findAll(pageable);

        if (offers.isEmpty()) {
            throw new DataExitsException("No offers found");
        }
        return pagedResourcesAssembler.toModel(offers.map(OfferResponse::new));
    }

    @Override
    public ApiResponse createOffer(OfferDto offerDto) throws DataExitsException {
        Dish dish = dishRepository.findById(offerDto.getDishId())
                .orElseThrow(() -> new DataExitsException("Dish not found"));
        if (offerRepository.existsByDish(dish)) {
            throw new DataExitsException("Offer already exists for this dish");
        }

        if (offerDto.getStartDate().isAfter(offerDto.getEndDate())) {
            throw new DataExitsException("Start date must be before end date");
        }

        if (offerDto.getDiscountPercentage() > 100 || offerDto.getDiscountPercentage() <= 0) {
            throw new DataExitsException("Discount percentage must be less than or equal to 100 and greater than 0");
        }

        Offer offer = new Offer();
        offer.setDish(dish);
        offer.setOfferType(offerDto.getOfferType().toUpperCase());
        offer.setStartDate(offerDto.getStartDate());
        offer.setEndDate(offerDto.getEndDate());
        offer.setDiscountPercentage(offerDto.getDiscountPercentage());

        offerRepository.save(offer);
        return new ApiResponse("Offer created successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateOffer(OfferDto offerDto) throws DataExitsException {
        Offer offer = offerRepository.findById(offerDto.getId())
                .orElseThrow(() -> new DataExitsException("Offer not found"));

        if (!offer.getDish().getId().equals(offerDto.getDishId()) &&
                offerRepository.existsByDish(offer.getDish())) {
            throw new DataExitsException("Offer already exists for this dish");
        }

        if (offerDto.getStartDate().isAfter(offerDto.getEndDate())) {
            throw new DataExitsException("Start date must be before end date");
        }
        if (offerDto.getDiscountPercentage() > 100 || offerDto.getDiscountPercentage() <= 0) {
            throw new DataExitsException("Discount percentage must be less than or equal to 100 and greater than 0");
        }

        offer.setOfferType(offerDto.getOfferType().toUpperCase());
        offer.setStartDate(offerDto.getStartDate());
        offer.setEndDate(offerDto.getEndDate());
        offer.setDiscountPercentage(offerDto.getDiscountPercentage());

        offerRepository.save(offer);
        return new ApiResponse("Offer updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteOffer(List<String> ids) {
        List<Offer> offers = ids.stream()
                .map(id -> offerRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Offer not found for ID: " + id)))
                .collect(Collectors.toList());

        offerRepository.deleteAll(offers);
        return new ApiResponse("Offers deleted successfully", HttpStatus.OK);
    }
}
