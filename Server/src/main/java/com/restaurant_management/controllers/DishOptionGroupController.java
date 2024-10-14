package com.restaurant_management.controllers;

import com.restaurant_management.dtos.DishOptionDto;
import com.restaurant_management.dtos.DishOptionGroupDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishOptionGroupRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishOptionGroupResponse;
import com.restaurant_management.payloads.responses.GetOptionNameResponse;
import com.restaurant_management.services.interfaces.DishOptionGroupService;
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
@Tag(name = "Dish Option Group", description = "Dish Option Group API")
@RequestMapping("/api/v1/dashboard/dish-option-group")
public class DishOptionGroupController {

    private final DishOptionGroupService dishOptionGroupService;

    @GetMapping("/get-all-option-name")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GetOptionNameResponse>> getAllOptionName() throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.getAllOptionName());
    }

    @GetMapping("/get-all-dish-option-groups")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<DishOptionGroupResponse>>> getAllDishOptionGroups(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "groupName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.getAllDishOptionGroups(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-dish-option-group")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addDishOptionGroup(@RequestBody DishOptionGroupDto request) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.addDishOptionGroup(request));
    }

    @PostMapping("/add-dish-options/{groupId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addDishOptions(@PathVariable String groupId, @RequestBody List<DishOptionDto> options) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.addDishOptions(groupId, options));
    }

    @PutMapping("/update-dish-option-group/{groupId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateDishOptionGroup(@PathVariable String groupId, @RequestBody DishOptionGroupRequest request) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.updateDishOptionGroup(groupId, request));
    }

    @DeleteMapping("/delete-dish-option-group/{groupId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteDishOptionGroup(@PathVariable String groupId) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.deleteDishOptionGroup(groupId));
    }

    @PutMapping("/update-dish-option/{optionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateDishOption(@PathVariable String optionId, @RequestBody DishOptionDto request) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.updateDishOption(optionId, request));
    }

    @DeleteMapping("/delete-dish-option/{optionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteDishOption(@PathVariable String optionId) throws DataExitsException {
        return ResponseEntity.ok(dishOptionGroupService.deleteDishOption(optionId));
    }
}