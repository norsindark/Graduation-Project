package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.DishImageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Dish Image", description = "Dish Image API")
@RequestMapping("/api/v1/dashboard/dish")
public class DishImageController {

    private final DishImageService dishImageService;

    @DeleteMapping("/image/{dishImageId}")
    public ResponseEntity<ApiResponse> deleteDishImage(@PathVariable String dishImageId) throws DataExitsException, IOException {
        return ResponseEntity.ok(dishImageService.deleteDishImage(dishImageId));
    }
}
