package com.restaurant_management.controllers;

import com.restaurant_management.dtos.DishDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishResponse;
import com.restaurant_management.services.interfaces.DishService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Dish", description = "Dish API")
@RequestMapping("/api/v1/dashboard/dish")
public class DishController {

    private final DishService dishService;

    @GetMapping("/get-all-dishes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<DishResponse>>> getAllDishes(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "dishName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(dishService.getAllDishes(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-new-dish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addNewDish(@ModelAttribute DishDto dishDto) throws DataExitsException, IOException {
        return ResponseEntity.ok(dishService.addDish(dishDto));
    }

}