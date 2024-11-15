package com.restaurant_management.repositories;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.User;
import com.restaurant_management.entites.Wishlist;
import com.restaurant_management.payloads.responses.DishFromWishlistResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, String> {
    Page<Wishlist> findByUser(User user, Pageable pageable);
    boolean existsByUserIdAndDishId(String userId, String dishId);

    Optional<Wishlist> findByUserAndDish(User userId, Dish dishId);

    @Query("SELECT new com.restaurant_management.payloads.responses.DishFromWishlistResponse(d.id, d.dishName, d.slug, d.description, d.status, d.thumbImage, d.offerPrice, d.price) " +
            "FROM Wishlist w JOIN w.dish d WHERE w.id = :wishlistId")
    List<DishFromWishlistResponse> findDishesByWishlist(@Param("wishlistId") String wishlistId);

    @Modifying
    @Query("DELETE FROM Wishlist w WHERE w.dish = :dish")
    void deleteWishlistByDish(@Param("dish") Dish dish);
}
