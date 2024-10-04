package com.restaurant_management.services.impls;

import com.restaurant_management.repositories.DishRepository;
import com.restaurant_management.repositories.RecipeRepository;
import com.restaurant_management.services.interfaces.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {
    private final DishRepository dishRepository;
    private final RecipeRepository recipeRepository;
}
