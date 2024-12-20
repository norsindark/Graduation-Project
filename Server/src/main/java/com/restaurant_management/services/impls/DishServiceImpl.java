package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.DishDto;
import com.restaurant_management.dtos.DishOptionSelectionDto;
import com.restaurant_management.dtos.ImageDto;
import com.restaurant_management.dtos.RecipeDto;
import com.restaurant_management.entites.*;
import com.restaurant_management.enums.UnitType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishOptionSelectionRequest;
import com.restaurant_management.payloads.requests.DishRequest;
import com.restaurant_management.payloads.requests.RecipeRequest;
import com.restaurant_management.payloads.requests.UpdateThumbRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishResponse;
import com.restaurant_management.payloads.responses.SearchDishResponse;
import com.restaurant_management.repositories.*;
import com.restaurant_management.services.interfaces.DishService;
import com.restaurant_management.services.interfaces.ReviewService;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {
    private final DishImageRepository dishImageRepository;
    private final DishRepository dishRepository;
    private final OfferRepository offerRepository;
    private final ReviewService reviewService;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final ImgBBUploaderUtil imgBBUploaderUtil;
    private final DishOptionRepository dishOptionRepository;
    private final DishOptionSelectionRepository dishOptionSelectionRepository;
    private final WishlistRepository wishlistRepository;
    private final PagedResourcesAssembler<DishResponse> pagedResourcesAssembler;

    @Override
    public List<SearchDishResponse> getAllDishToSearch() throws DataExitsException {
        List<SearchDishResponse> dishes = dishRepository.findAllDishToSearch();
        if (dishes.isEmpty()) {
            throw new DataExitsException("Dishes not found");
        }
        return dishes;
    }

    @Override
    public List<Map<String, String>> getAllDishNames() throws DataExitsException {
        List<Map<String, String>> dishes = dishRepository.getAllDishNames();
        if (dishes.isEmpty()) {
            throw new DataExitsException("Dishes not found");
        }

        Set<String> offerDishIds = offerRepository.findAll().stream()
                .map(offer -> String.valueOf(offer.getDish().getId()))
                .collect(Collectors.toSet());

        dishes.removeIf(dish -> offerDishIds.contains(dish.get("dishId")));

        return dishes;
    }

    @Override
    public DishResponse getDishById(String dishId) throws DataExitsException {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new DataExitsException("Dish not found"));

        List<Recipe> recipes = recipeRepository.findByDish(dish);
        List<DishImage> images = dishImageRepository.findByDish(dish);
        List<DishOptionSelection> optionSelections = dishOptionSelectionRepository.findByDish(dish);
        int maxAvailableQuantity = getMaxAvailableDishQuantity(dishId);
        Double rating = reviewService.getAverageRatingByDishId(dishId);
        Integer discount = offerRepository.findDiscountPercentageByDishId(dishId).orElse(0);
        Double offerPrice = dish.getPrice() - (dish.getPrice() * discount / 100.0);
        dish.setOfferPrice(offerPrice);

        return new DishResponse(dish, recipes, images, optionSelections, maxAvailableQuantity, rating, discount);
    }

    @Override
    public PagedModel<EntityModel<DishResponse>> getAllDishes(int pageNo, int pageSize, String sortBy, String order)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(order), sortBy));
        Page<Dish> dishes = dishRepository.findAll(pageable);

        if (dishes.isEmpty()) {
            throw new DataExitsException("Dishes not found");
        }

        List<DishResponse> dishResponses = dishes.stream()
                .map(dish -> {
                    List<Recipe> recipes = recipeRepository.findByDish(dish);

                    List<DishImage> images = dishImageRepository.findByDish(dish);

                    List<DishOptionSelection> optionSelections = dishOptionSelectionRepository.findByDish(dish);

                    int maxAvailableQuantity = getMaxAvailableDishQuantity(dish.getId());

                    Double rating = 0.0;
                    try {
                        rating = reviewService.getAverageRatingByDishId(dish.getId());
                    } catch (DataExitsException e) {
                        e.printStackTrace();
                    }
                    Integer discount = offerRepository.findDiscountPercentageByDishId(dish.getId()).orElse(0);
                    Double offerPrice = dish.getPrice() - (dish.getPrice() * discount / 100.0);
                    dish.setOfferPrice(offerPrice);

                    return new DishResponse(dish, recipes, images, optionSelections, maxAvailableQuantity, rating, discount);
                })
                .collect(Collectors.toList());
        return pagedResourcesAssembler.toModel(new PageImpl<>(dishResponses, pageable, dishes.getTotalElements()));
    }

    private int getMaxAvailableDishQuantity(String dishId) {
        return dishRepository.findById(dishId)
                .map(dish -> {
                    List<Recipe> recipes = recipeRepository.findByDish(dish);

                    return recipes.stream()
                            .mapToInt(recipe -> {
                                UnitType recipeUnit = UnitType.fromString(recipe.getUnit());
                                String warehouseId = recipe.getWarehouse().getId();

                                return warehouseRepository.findById(warehouseId)
                                        .map(warehouse -> {
                                            UnitType warehouseUnit = UnitType.fromString(warehouse.getUnit());

                                            double availableInWarehouse = warehouse.getAvailableQuantity();

//                                            System.out.println("Converting ingredient: " + recipe.getWarehouse().getIngredientName() +
//                                                    ". Warehouse available quantity: " + availableInWarehouse + " " + warehouseUnit +
//                                                    ". Recipe unit: " + recipeUnit + ". Warehouse unit: " + warehouseUnit);

                                            double convertedQuantity = UnitType.convert(availableInWarehouse, warehouseUnit, recipeUnit);

//                                            System.out.println("Converted ingredient: " + recipe.getWarehouse().getIngredientName() +
//                                                    ". Converted quantity: " + convertedQuantity + " " + recipeUnit);

                                            return (int) (convertedQuantity / recipe.getQuantityUsed());
                                        })
                                        .orElse(0);
                            })
                            .min()
                            .orElse(0);
                })
                .orElse(0);
    }

    @Override
    @Transactional
    public ApiResponse addDish(DishDto dishDto) throws DataExitsException, IOException {
        Category category = getCategory(dishDto.getCategoryId());
        String thumbImageUrl = null;
        String deleteThumbUrl = null;
        if (dishDto.getThumbImage() != null) {
            String[] uploadResult = uploadThumbnail(dishDto.getThumbImage());
            thumbImageUrl = uploadResult[0];
            deleteThumbUrl = uploadResult[1];
        }

        Dish dish = createDish(dishDto, category, thumbImageUrl, deleteThumbUrl);
        List<Recipe> recipes = createRecipes(dishDto.getRecipes(), dish);

        if (recipes.isEmpty()) {
            throw new DataExitsException("No valid ingredients found for the dish.");
        }

        dish = dishRepository.save(dish);
        if (dishDto.getImages() != null && !dishDto.getImages().isEmpty()) {
            uploadImages(dishDto.getImages(), dish);
        }

        if (dishDto.getOptionSelections() != null && !dishDto.getOptionSelections().isEmpty()) {
            addNewOption(dish, dishDto.getOptionSelections());
        }

        recipeRepository.saveAll(recipes);
        return new ApiResponse("Dish added successfully", HttpStatus.OK);
    }


    @Override
    public ApiResponse updateThumbnail(UpdateThumbRequest request) throws DataExitsException, IOException {
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new DataExitsException("Dish not found"));

        String[] uploadResult = uploadThumbnail(request.getThumbImage());

        dish.setThumbImage(uploadResult[0]);
        dish.setDeleteThumbImage(uploadResult[1]);

        dishRepository.save(dish);
        return new ApiResponse("Thumbnail updated successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse deleteDish(String dishId) throws DataExitsException {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new DataExitsException("Dish not found"));

        wishlistRepository.deleteWishlistByDish(dish);
        recipeRepository.deleteAll(recipeRepository.findByDish(dish));
        dishRepository.delete(dish);

        return new ApiResponse("Dish deleted successfully", HttpStatus.OK);
    }

    private Dish createDish(DishDto dishDto, Category category, String thumbImageUrl, String deleteThumbUrl) {
        return Dish.builder()
                .dishName(dishDto.getDishName())
                .slug(dishDto.getDishName().toLowerCase().replace(" ", "-"))
                .description(dishDto.getDescription())
                .longDescription(dishDto.getLongDescription())
                .status(dishDto.getStatus())
                .thumbImage(thumbImageUrl)
                .deleteThumbImage(deleteThumbUrl)
                .offerPrice(dishDto.getOfferPrice())
                .price(dishDto.getPrice())
                .category(category)
                .build();
    }

    private void updateDishDetails(DishRequest request, Dish dish, Category category) {
        dish.setDishName(request.getDishName());
        dish.setSlug(request.getDishName().toLowerCase().replace(" ", "-"));
        dish.setDescription(request.getDescription());
        dish.setLongDescription(request.getLongDescription());
        dish.setStatus(request.getStatus());
        dish.setOfferPrice(request.getOfferPrice());
        dish.setPrice(request.getPrice());
        dish.setCategory(category);
    }

    private String[] uploadThumbnail(MultipartFile thumbImage) throws IOException {
        Map<String, String> uploadResult = imgBBUploaderUtil.uploadImage(thumbImage);
        return new String[]{uploadResult.get("imageUrl"), uploadResult.get("deleteUrl")};
    }


    private Category getCategory(String categoryId) throws DataExitsException {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataExitsException("Category not found"));
    }

    private void updateThumbnailIfPresent(DishRequest request, Dish dish) throws IOException {
        if (request.getThumbImage() != null) {
            String[] uploadResult = uploadThumbnail(request.getThumbImage());
            dish.setThumbImage(uploadResult[0]);
            dish.setDeleteThumbImage(uploadResult[1]);
        }
    }

    private void uploadImages(List<ImageDto> imageDtos, Dish dish) throws IOException {
        for (ImageDto imageDto : imageDtos) {
            String[] uploadResult = uploadThumbnail(imageDto.getImageFile());
            DishImage dishImage = new DishImage();
            dishImage.setDish(dish);
            dishImage.setImageUrl(uploadResult[0]);
            dishImage.setDeleteUrl(uploadResult[1]);
            dishImageRepository.save(dishImage);
        }
    }

    private List<Recipe> createRecipes(List<RecipeDto> recipeDtos, Dish dish) throws DataExitsException {
        return recipeDtos.stream()
                .map(recipeDto -> {
                    Warehouse warehouse = warehouseRepository.findById(recipeDto.getWarehouseId())
                            .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                    return Recipe.builder()
                            .dish(dish)
                            .warehouse(warehouse)
                            .quantityUsed(recipeDto.getQuantityUsed())
                            .unit(recipeDto.getUnit())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiResponse updateDish(DishRequest request) throws DataExitsException, IOException {
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new DataExitsException("Dish not found"));
        Category category = getCategory(request.getCategoryId());

        updateThumbnailIfPresent(request, dish);
        updateDishDetails(request, dish, category);
        dishRepository.save(dish);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            uploadImages(request.getImages(), dish);
        }

        if (request.getRecipes() != null && !request.getRecipes().isEmpty()) {
            updateRecipes(request.getRecipes(), dish);
        }

        if (request.getOptionSelections() != null && !request.getOptionSelections().isEmpty()) {
            updateOptionSelection(request);
            removeExtraOptionSelectionsIfNeeded(request.getOptionSelections(), dish);
        } else {
            removeAllOptionSelections(dish);
        }


        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            addNewOption(dish, request.getOptions());
        }

        return new ApiResponse("Dish updated successfully", HttpStatus.OK);
    }


    private void updateRecipes(List<RecipeRequest> requests, Dish dish) throws DataExitsException {
        List<String> requestRecipeIds = requests.stream()
                .map(RecipeRequest::getRecipeId)
                .filter(Objects::nonNull)
                .toList();

        List<Recipe> existingRecipes = recipeRepository.findByDish(dish);

        List<Recipe> recipesToDelete = existingRecipes.stream()
                .filter(recipe -> !requestRecipeIds.contains(recipe.getId()))
                .collect(Collectors.toList());

        recipeRepository.deleteAll(recipesToDelete);

        for (RecipeRequest request : requests) {
            Recipe recipe;

            if (request.getRecipeId() == null || request.getRecipeId().isEmpty()) {
                recipe = new Recipe();
            } else {
                recipe = recipeRepository.findById(request.getRecipeId())
                        .orElseThrow(() -> new DataExitsException("Recipe not found"));
            }

            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new DataExitsException("Ingredient not found"));

            recipe.setDish(dish);
            recipe.setWarehouse(warehouse);
            recipe.setQuantityUsed(request.getQuantityUsed());
            recipe.setUnit(request.getUnit());

            recipeRepository.save(recipe);
        }
    }

    private void addNewOption(Dish dish, List<DishOptionSelectionDto> optionSelections) throws DataExitsException {
        List<DishOption> options = dishOptionRepository.findAllById(optionSelections
                .stream()
                .map(DishOptionSelectionDto::getOptionId)
                .collect(Collectors.toList()));

        if (options.isEmpty()) {
            throw new DataExitsException("No valid options found.");
        }

        options.forEach(option -> {
            DishOptionSelection newSelection = new DishOptionSelection();
            newSelection.setDish(dish);
            newSelection.setDishOption(option);
            newSelection.setAdditionalPrice(optionSelections.stream()
                    .filter(selection -> selection.getOptionId().equals(option.getId()))
                    .findFirst()
                    .map(DishOptionSelectionDto::getAdditionalPrice)
                    .orElse(0.0));
            dishOptionSelectionRepository.save(newSelection);

            if (dish.getSelectedOptions() == null) {
                dish.setSelectedOptions(new ArrayList<>());
            }
            dish.getSelectedOptions().add(newSelection);
        });
    }

    private void updateOptionSelection(DishRequest request) {
        List<Object[]> selections = dishOptionSelectionRepository.findAllById(request.getOptionSelections()
                .stream()
                .map(DishOptionSelectionRequest::getOptionSelectionId)
                .collect(Collectors.toList()));

        if (selections.isEmpty()) {
            throw new RuntimeException("No valid selections found.");
        }

        selections.forEach(selection -> {
            String id = (String) selection[0];
            Double currentAdditionalPrice = (Double) selection[1];

            DishOptionSelectionRequest matchingRequest = request.getOptionSelections().stream()
                    .filter(optionSelection -> optionSelection.getOptionSelectionId().equals(id))
                    .findFirst()
                    .orElse(null);

            if (matchingRequest != null) {
                Double newAdditionalPrice = matchingRequest.getAdditionalPrice();

                if (!currentAdditionalPrice.equals(newAdditionalPrice)) {
                    dishOptionSelectionRepository.updateAdditionalPriceById(id, newAdditionalPrice);
                }
            }
        });
    }

    private void removeExtraOptionSelectionsIfNeeded(List<DishOptionSelectionRequest> optionSelections, Dish dish) {
        List<String> requestOptionIds = optionSelections.stream()
                .map(DishOptionSelectionRequest::getOptionSelectionId)
                .toList();
        List<DishOptionSelection> existingOptionSelections = dishOptionSelectionRepository.findByDish(dish);
        List<DishOptionSelection> optionsToDelete = existingOptionSelections.stream()
                .filter(optionSelection -> !requestOptionIds.contains(optionSelection.getId()))
                .collect(Collectors.toList());
        if (!optionsToDelete.isEmpty()) {
            dishOptionSelectionRepository.deleteAll(optionsToDelete);
        }
    }

    private void removeAllOptionSelections(Dish dish) {
        List<DishOptionSelection> existingOptionSelections = dishOptionSelectionRepository.findByDish(dish);
        if (!existingOptionSelections.isEmpty()) {
            existingOptionSelections.forEach(optionSelection ->
                    System.out.println("Option to delete: " + optionSelection.getId())
            );

            System.out.println("Options to delete: " + existingOptionSelections.size());
            dishOptionSelectionRepository.deleteAll(existingOptionSelections);
        }
    }

}
