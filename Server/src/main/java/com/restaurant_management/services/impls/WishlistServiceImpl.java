package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.User;
import com.restaurant_management.entites.Wishlist;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishFromWishlistResponse;
import com.restaurant_management.payloads.responses.WishlistResponse;
import com.restaurant_management.repositories.DishRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.WishlistRepository;
import com.restaurant_management.services.interfaces.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final DishRepository dishRepository;
    private final PagedResourcesAssembler<WishlistResponse> pagedResourcesAssembler;


    @Override
    public PagedModel<EntityModel<WishlistResponse>> getWishlistByUserId(String userId, int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
        User user = userRepository.findById(userId).orElseThrow(() -> new DataExitsException("User not found"));
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Wishlist> wishlistPage = wishlistRepository.findByUser(user, pageable);
        List<WishlistResponse> wishlistResponses = wishlistPage.stream()
                .map(wishlist -> {
                    List<DishFromWishlistResponse> dishes = wishlistRepository.findDishesByWishlist(wishlist.getId());
                    if (dishes.isEmpty()) {
                        throw new RuntimeException("Dishes not found in wishlist");
                    }
                    return new WishlistResponse(wishlist, dishes);
                }).toList();
        return pagedResourcesAssembler.toModel(new PageImpl<>(wishlistResponses, pageable, wishlistPage.getTotalElements()));
    }

    @Override
    public ApiResponse addDishToWishlist(String dishId, String userId) throws DataExitsException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataExitsException("User not found"));
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new DataExitsException("Dish not found"));
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setDish(dish);
        wishlistRepository.save(wishlist);
        return new ApiResponse( "Dish added to wishlist", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse removeDishFromWishlist(String dishId, String userId) throws DataExitsException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataExitsException("User not found"));
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new DataExitsException("Dish not found"));
        Wishlist wishlist = wishlistRepository.findByUserAndDish(user, dish)
                .orElseThrow(() -> new DataExitsException("Dish not found in wishlist"));
        wishlistRepository.delete(wishlist);
        return new ApiResponse("Dish removed from wishlist", HttpStatus.OK);
    }
}
