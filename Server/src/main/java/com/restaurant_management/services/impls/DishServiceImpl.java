package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.DishDto;
import com.restaurant_management.dtos.ImageDto;
import com.restaurant_management.dtos.RecipeDto;
import com.restaurant_management.entites.*;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishRequest;
import com.restaurant_management.payloads.requests.RecipeRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishResponse;
import com.restaurant_management.repositories.*;
import com.restaurant_management.services.interfaces.DishService;
import com.restaurant_management.utils.ImgBBUploaderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {
    private final DishImageRepository dishImageRepository;
    private final DishRepository dishRepository;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final ImgBBUploaderUtil imgBBUploaderUtil;
    private final PagedResourcesAssembler<DishResponse> pagedResourcesAssembler;

    @Override
    public PagedModel<EntityModel<DishResponse>> getAllDishes(int pageNo, int pageSize, String sortBy, String order) throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(order), sortBy));
        Page<Dish> dishes = dishRepository.findAll(pageable);

        if (dishes.isEmpty()) {
            throw new DataExitsException("Dishes not found");
        }

        List<DishResponse> dishResponses = new ArrayList<>();
        for (Dish dish : dishes) {
            List<Recipe> recipes = recipeRepository.findByDish(dish);
            List<DishImage> images = dishImageRepository.findByDish(dish);
            dishResponses.add(new DishResponse(dish, recipes, images));
        }

        Page<DishResponse> dishResponsePage = new PageImpl<>(dishResponses, pageable, dishes.getTotalElements());
        return pagedResourcesAssembler.toModel(dishResponsePage);
    }

    @Override
    @Transactional
    public ApiResponse addDish(DishDto dishDto) throws DataExitsException, IOException {
        Category category = getCategory(dishDto.getCategoryId());

        String thumbImageUrl = uploadThumbnail(dishDto.getThumbImage());

        Dish dish = createDish(dishDto, category, thumbImageUrl);
        dish = dishRepository.save(dish);

        if (dishDto.getImages() != null && !dishDto.getImages().isEmpty()) {
            uploadImages(dishDto.getImages(), dish);
        }

        List<Recipe> recipes = createRecipes(dishDto.getRecipes(), dish);
        recipeRepository.saveAll(recipes);

        return new ApiResponse("Dish added successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse updateDish(DishRequest request) throws DataExitsException, IOException {
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new DataExitsException("Dish not found"));
        Category category = getCategory(request.getCategoryId());

        if (request.getThumbImage() != null) {
            String thumbImageUrl = imgBBUploaderUtil.uploadImage(request.getThumbImage());
            dish.setThumbImage(thumbImageUrl);
        }

        dish.setDishName(request.getDishName());
        dish.setDescription(request.getDescription());
        dish.setStatus(request.getStatus());
        dish.setOfferPrice(request.getOfferPrice());
        dish.setPrice(request.getPrice());
        dish.setCategory(category);

        dishRepository.save(dish);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            uploadImages(request.getImages(), dish);
        }

        if (request.getRecipes() != null && !request.getRecipes().isEmpty()) {
            updateRecipes(request.getRecipes(), dish);
        }

        return new ApiResponse("Dish updated successfully", HttpStatus.OK);
    }

    private Category getCategory(String categoryId) throws DataExitsException {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataExitsException("Category not found"));
    }

    private String uploadThumbnail(MultipartFile thumbImage) throws IOException {
        return imgBBUploaderUtil.uploadImage(thumbImage);
    }

    private Dish createDish(DishDto dishDto, Category category, String thumbImageUrl) {
        return Dish.builder()
                .dishName(dishDto.getDishName())
                .description(dishDto.getDescription())
                .status(dishDto.getStatus())
                .thumbImage(thumbImageUrl)
                .offerPrice(dishDto.getOfferPrice())
                .price(dishDto.getPrice())
                .category(category)
                .build();
    }

    private void uploadImages(List<ImageDto> imageDtos, Dish dish) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        for (ImageDto imageDto : imageDtos) {
            String imageUrl = imgBBUploaderUtil.uploadImage(imageDto.getImageFile());
            imageUrls.add(imageUrl);
        }

        for (String imageUrl : imageUrls) {
            DishImage dishImage = new DishImage();
            dishImage.setDish(dish);
            dishImage.setImageUrl(imageUrl);

            dishImageRepository.save(dishImage);
        }
    }


    private List<Recipe> createRecipes(List<RecipeDto> recipeDtos, Dish dish) throws DataExitsException {
        List<Recipe> recipes = new ArrayList<>();
        for (RecipeDto recipeDto : recipeDtos) {
            Warehouse warehouse = warehouseRepository.findById(recipeDto.getWarehouseId())
                    .orElseThrow(() -> new DataExitsException("Ingredient not found"));
            Recipe recipe = Recipe.builder()
                    .dish(dish)
                    .warehouse(warehouse)
                    .quantityUsed(recipeDto.getQuantityUsed())
                    .unit(recipeDto.getUnit())
                    .build();
            recipes.add(recipe);
        }
        return recipes;
    }

    private void updateRecipes(List<RecipeRequest> requests, Dish dish) throws DataExitsException {
        for (RecipeRequest request : requests) {
            Recipe recipe = recipeRepository.findById(request.getRecipeId())
                    .orElseThrow(() -> new DataExitsException("Recipe not found"));

            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new DataExitsException("Ingredient not found"));

            recipe.setDish(dish);
            recipe.setWarehouse(warehouse);
            recipe.setQuantityUsed(request.getQuantityUsed());
            recipe.setUnit(request.getUnit());

            recipeRepository.save(recipe);
        }
    }


}