package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Recipe;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.RecipeRepository;
import com.restaurant_management.services.interfaces.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {
    private final RecipeRepository recipeRepository;

    @Override
    @Modifying
    public ApiResponse deleteRecipes(String recipeId) throws DataExitsException {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new DataExitsException("Recipe not found"));
        recipeRepository.delete(recipe);
        return new ApiResponse("Recipe deleted successfully", HttpStatus.OK);
    }
}
