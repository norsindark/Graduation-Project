package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.LocationRestaurantDto;
import com.restaurant_management.entites.LocationRestaurant;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;

public interface LocationRestaurantService {
    LocationRestaurant getLocation() throws DataExitsException;
    ApiResponse createLocation(LocationRestaurantDto locationRestaurantDto) throws DataExitsException;
    ApiResponse updateLocation(LocationRestaurantDto locationRestaurantDto) throws DataExitsException;
    ApiResponse deleteLocation(String id) throws DataExitsException;
}