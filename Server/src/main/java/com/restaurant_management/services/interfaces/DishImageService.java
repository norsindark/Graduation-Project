package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;

import java.io.IOException;

public interface DishImageService {

    ApiResponse deleteDishImage(String id) throws DataExitsException, IOException;
}
