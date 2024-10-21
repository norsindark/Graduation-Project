package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.payloads.responses.DishResponse;
import com.restaurant_management.payloads.responses.GetCategoriesNameResponse;
import com.restaurant_management.services.interfaces.CategoryService;
import com.restaurant_management.services.interfaces.DishService;
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
@Tag(name = "Guest", description = "Guest API")
@RequestMapping("/api/v1/auth/guest")
public class GuestController {

    private final DishService dishService;
    private final CategoryService categoryService;

    @GetMapping("/get-dish-by-id/{dishId}")
    public ResponseEntity<DishResponse> getDishById(@PathVariable String dishId) throws DataExitsException {
        return ResponseEntity.ok(dishService.getDishById(dishId));
    }

    @GetMapping("/get-all-dishes")
    public ResponseEntity<PagedModel<EntityModel<DishResponse>>> getAllDishes(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "dishName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(dishService.getAllDishes(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-all-categories-name")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<List<GetCategoriesNameResponse>> getAllCategoriesName() throws DataExitsException {
        return ResponseEntity.ok(categoryService.getAllCategoriesName());
    }

    @GetMapping("/get-all-categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<PagedModel<EntityModel<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(categoryService.getAllCategories(pageNo, pageSize, sortBy, sortDir));
    }
}
