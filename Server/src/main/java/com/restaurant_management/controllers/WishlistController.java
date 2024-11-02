package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.WishlistResponse;
import com.restaurant_management.services.interfaces.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist API")
@RequestMapping("/api/v1/client/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/get-wishlist-by-user-id")
    public ResponseEntity<PagedModel<EntityModel<WishlistResponse>>> getWishlistByUserId(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId, pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-dish-to-wishlist")
    public ResponseEntity<ApiResponse> addDishToWishlist(@RequestParam String dishId, @RequestParam String userId)
            throws DataExitsException {
        return ResponseEntity.ok(wishlistService.addDishToWishlist(dishId, userId));
    }

    @DeleteMapping("/remove-dish-from-wishlist")
    public ResponseEntity<ApiResponse> removeDishFromWishlist(@RequestParam String dishId, @RequestParam String userId)
            throws DataExitsException {
        return ResponseEntity.ok(wishlistService.removeDishFromWishlist(dishId, userId));
    }
}
