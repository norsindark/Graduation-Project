package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.RecipeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Recipe", description = "Recipe API")
@RequestMapping("/api/v1/dashboard/recipe")
public class RecipeController {

    private final RecipeService recipeService;

    @DeleteMapping("/delete-recipe/{recipeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteRecipe(String recipeId) throws DataExitsException {
        return ResponseEntity.ok(recipeService.deleteRecipes(recipeId));
    }
}
