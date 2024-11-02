package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.WishlistResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface WishlistService {

    PagedModel<EntityModel<WishlistResponse>> getWishlistByUserId(
            String userId, int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException;

    ApiResponse addDishToWishlist(String dishId, String userId) throws DataExitsException;

    ApiResponse removeDishFromWishlist(String dishId, String userId) throws DataExitsException;
}
