package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.DishDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.io.IOException;

public interface DishService {

    PagedModel<EntityModel<DishResponse>> getAllDishes(int pageNo, int pageSize, String sortBy, String order) throws DataExitsException;
    ApiResponse addDish(DishDto dishDto) throws DataExitsException, IOException;

    ApiResponse updateDish(DishRequest request) throws DataExitsException, IOException;
}
