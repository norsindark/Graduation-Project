package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.OfferDto;
import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Offer;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OfferResponse;
import com.restaurant_management.repositories.DishRepository;
import com.restaurant_management.repositories.OfferRepository;
import com.restaurant_management.services.interfaces.EmailService;
import com.restaurant_management.services.interfaces.OfferService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OfferServiceImpl implements OfferService {

    private final EmailService emailService;
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
        offers.forEach(this::checkValidOffer);

        if (offers.isEmpty()) {
            throw new DataExitsException("No offers found");
        }
        return pagedResourcesAssembler.toModel(offers.map(OfferResponse::new));
    }

    @Override
    public ApiResponse createOffers(List<OfferDto> offerDtos) throws DataExitsException, MessagingException, UnsupportedEncodingException {
        List<String> responseMessages = new ArrayList<>();

        for (OfferDto offerDto : offerDtos) {
            Dish dish = dishRepository.findById(offerDto.getDishId())
                    .orElseThrow(() -> new DataExitsException("Dish not found for dish ID: " + offerDto.getDishId()));

            if (offerRepository.existsByDish(dish)) {
                throw new DataExitsException("Offer already exists for dish ID: " + offerDto.getDishId());
            }

            if (offerDto.getStartDate().isAfter(offerDto.getEndDate())) {
                throw new DataExitsException("Start date must be before end date for dish ID: " + offerDto.getDishId());
            }

            if (offerDto.getDiscountPercentage() > 100 || offerDto.getDiscountPercentage() <= 0) {
                throw new DataExitsException("Discount percentage must be between 1 and 100 for dish ID: " + offerDto.getDishId());
            }

            Offer offer = new Offer();
            offer.setDish(dish);
            offer.setOfferType(offerDto.getOfferType().toUpperCase());
            offer.setStartDate(offerDto.getStartDate());
            offer.setEndDate(offerDto.getEndDate());
            offer.setDiscountPercentage(offerDto.getDiscountPercentage());
            offer.setAvailableQuantityOffer(offerDto.getAvailableQuantityOffer());

            offerRepository.save(offer);
            responseMessages.add("Offer created successfully for dish ID: " + offerDto.getDishId());

            if (offer.getOfferType().equals("FIRST_TIME_CUSTOMER_OFFER")
                            || offer.getOfferType().equals("MONTHLY_SPECIAL")
                            || offer.getOfferType().equals("MEMBERSHIP")) {
                emailService.sendOfferNotification(offer);
            }
        }

        return new ApiResponse(String.join("; ", responseMessages), HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateOffers(List<OfferDto> offerDtos) throws DataExitsException, MessagingException, UnsupportedEncodingException {
        List<String> responseMessages = new ArrayList<>();

        for (OfferDto offerDto : offerDtos) {
            Offer offer = offerRepository.findById(offerDto.getId())
                    .orElseThrow(() -> new DataExitsException("Offer not found for offer ID: " + offerDto.getId()));

            if (!offer.getDish().getId().equals(offerDto.getDishId()) &&
                    offerRepository.existsByDish(offer.getDish())) {
                throw new DataExitsException("Offer already exists for dish ID: " + offerDto.getDishId());
            }

            if (offerDto.getStartDate().isAfter(offerDto.getEndDate())) {
                throw new DataExitsException("Start date must be before end date for offer ID: " + offerDto.getId());
            }

            if (offerDto.getDiscountPercentage() > 100 || offerDto.getDiscountPercentage() <= 0) {
                throw new DataExitsException("Discount percentage must be between 1 and 100 for offer ID: " + offerDto.getId());
            }

            offer.setOfferType(offerDto.getOfferType().toUpperCase());
            offer.setStartDate(offerDto.getStartDate());
            offer.setEndDate(offerDto.getEndDate());
            offer.setDiscountPercentage(offerDto.getDiscountPercentage());
            offer.setAvailableQuantityOffer(offerDto.getAvailableQuantityOffer());

            offerRepository.save(offer);
            responseMessages.add("Offer updated successfully for offer ID: " + offerDto.getId());

            if (offer.getOfferType().equals("FIRST_TIME_CUSTOMER_OFFER")
                    || offer.getOfferType().equals("MONTHLY_SPECIAL")
                    || offer.getOfferType().equals("MEMBERSHIP")) {
                emailService.sendOfferNotification(offer);
            }
        }

        return new ApiResponse(String.join("; ", responseMessages), HttpStatus.OK);
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

    private void checkValidOffer(Offer offer) {
        if (offer.getAvailableQuantityOffer() == 0) {
            offerRepository.delete(offer);
        }
        if (offer.getEndDate().isBefore(java.time.LocalDate.now())) {
            offerRepository.delete(offer);
        }
    }


}
