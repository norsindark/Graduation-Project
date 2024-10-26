package com.restaurant_management.controllers;

import com.restaurant_management.payloads.responses.GeocodingResponse;
import com.restaurant_management.services.interfaces.GeocodingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Geocoding", description = "Geocoding API")
@RequestMapping("/api/v1/client/geocoding")
public class GeocodingController {
    private final GeocodingService geocodingService;

    @GetMapping("/coordinates")
    public ResponseEntity<GeocodingResponse> getCoordinates(
            @RequestParam String address) {
        return ResponseEntity.ok(geocodingService.getCoordinates(address));
    }
}
