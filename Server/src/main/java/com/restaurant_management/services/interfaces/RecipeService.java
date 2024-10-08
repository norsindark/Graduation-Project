package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;

public interface RecipeService {

    ApiResponse deleteRecipes(String recipeId) throws DataExitsException;
}
