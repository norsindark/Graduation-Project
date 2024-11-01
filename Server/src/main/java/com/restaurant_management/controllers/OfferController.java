package com.restaurant_management.controllers;

import com.restaurant_management.dtos.OfferDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.OfferResponse;
import com.restaurant_management.services.interfaces.OfferService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Offer", description = "Offer API")
@RequestMapping("/api/v1/dashboard/offer")
public class OfferController {
    private final OfferService offerService;

    @GetMapping("/get-all-offers")
    public ResponseEntity<PagedModel<EntityModel<OfferResponse>>> getAllOffers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(offerService.getAllOffers(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-offer-by-id")
    public ResponseEntity<OfferResponse> getOfferById(@RequestParam String id)
            throws DataExitsException {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    @PostMapping("/create-offer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createOffer(@RequestBody List<OfferDto> requests) throws DataExitsException {
        return ResponseEntity.ok(offerService.createOffers(requests));
    }

    @PutMapping("/update-offer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateOffer(@RequestBody List<OfferDto> requests) throws DataExitsException {
        return ResponseEntity.ok(offerService.updateOffers(requests));
    }

    @DeleteMapping("/delete-offer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteOffer(@RequestParam List<String> ids) {
        return ResponseEntity.ok(offerService.deleteOffer(ids));
    }
}
