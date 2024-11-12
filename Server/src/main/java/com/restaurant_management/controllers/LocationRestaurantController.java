package com.restaurant_management.controllers;

import com.restaurant_management.dtos.LocationRestaurantDto;
import com.restaurant_management.entites.LocationRestaurant;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.SettingRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.LocationRestaurantService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dashboards/locations")
@Tag(name = "Location Restaurant", description = "Location Restaurant API")
public class LocationRestaurantController {

    private final LocationRestaurantService locationRestaurantService;

    @GetMapping("/get-location")
    public ResponseEntity<LocationRestaurant> getLocation()
            throws DataExitsException {
        LocationRestaurant location = locationRestaurantService.getLocation();
        return ResponseEntity.ok(location);
    }

    @PostMapping("/create-location")
    public ResponseEntity<ApiResponse> createLocation(@RequestBody LocationRestaurantDto locationRestaurantDto)
    throws DataExitsException {
        locationRestaurantService.createLocation(locationRestaurantDto);
        return ResponseEntity.ok(new ApiResponse("Location created successfully", HttpStatus.CREATED));
    }

    @PutMapping("update-location")
    public ResponseEntity<ApiResponse> updateLocation(@RequestBody LocationRestaurantDto locationRestaurantDto)
    throws DataExitsException {
        locationRestaurantService.updateLocation(locationRestaurantDto);
        return ResponseEntity.ok(new ApiResponse("Location updated successfully", HttpStatus.OK));
    }

    @DeleteMapping("/delete-location/{id}")
    public ResponseEntity<ApiResponse> deleteLocation(@PathVariable String id)
    throws DataExitsException {
        locationRestaurantService.deleteLocation(id);
        return ResponseEntity.ok(new ApiResponse("Location deleted successfully", HttpStatus.OK));
    }

    @PutMapping("/setting-restaurant")
    public ResponseEntity<ApiResponse> settingRestaurant(@RequestBody SettingRequest request)
    throws DataExitsException {
        locationRestaurantService.settingRestaurant(request);
        return ResponseEntity.ok(new ApiResponse("Setting restaurant successfully", HttpStatus.OK));
    }

    @PutMapping("/setting-logo")
    public ResponseEntity<ApiResponse> settingLogo(
            @RequestParam("file") MultipartFile file)
    throws DataExitsException, IOException {
        locationRestaurantService.settingLogo(file);
        return ResponseEntity.ok(new ApiResponse("Setting logo successfully", HttpStatus.OK));
    }
}