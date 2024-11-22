package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.DishDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishRequest;
import com.restaurant_management.payloads.requests.UpdateThumbRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishResponse;
import com.restaurant_management.payloads.responses.SearchDishResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface DishService {
    List<Map<String, String>> getAllDishNames() throws DataExitsException;

    DishResponse getDishById(String dishId) throws DataExitsException;

    PagedModel<EntityModel<DishResponse>> getAllDishes(int pageNo, int pageSize, String sortBy, String order)
            throws DataExitsException;

    ApiResponse addDish(DishDto dishDto) throws DataExitsException, IOException;

    ApiResponse updateDish(DishRequest request) throws DataExitsException, IOException;

    ApiResponse deleteDish(String dishId) throws DataExitsException;

    ApiResponse updateThumbnail(UpdateThumbRequest request) throws DataExitsException, IOException;

    List<SearchDishResponse> getAllDishToSearch() throws DataExitsException;
}
