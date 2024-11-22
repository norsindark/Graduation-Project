package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.*;
import com.restaurant_management.services.interfaces.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Guest", description = "Guest API")
@RequestMapping("/api/v1/auth/guest")
public class GuestController {

    private final DishService dishService;
    private final CategoryService categoryService;
    private final CouponService couponService;
    private final ReviewService reviewService;
    private final OfferService offerService;
    private final BlogService blogService;
    private final CategoryBlogService categoryBlogService;
    private final CommentService commentService;

    // review
    @GetMapping("/get-all-reviews-by-dish")
    @Operation(summary = "Get all reviews by dish ID", tags = {"Review"})
    public ResponseEntity<PagedModel<EntityModel<ReviewResponse>>> getAllReviewsByDishId(
            @RequestParam String dishId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(reviewService.getAllReviewsByDishId(dishId, pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-average-rating-by-dish")
    @Operation(summary = "Get average rating by dish ID", tags = {"Review"})
    public ResponseEntity<Double> getAverageRatingByDishId(@RequestParam String dishId) throws DataExitsException {
        return ResponseEntity.ok(reviewService.getAverageRatingByDishId(dishId));
    }

    // dish
    @GetMapping("/get-dish-by-id/{dishId}")
    @Operation(summary = "Get dish by ID", tags = {"Dish"})
    public ResponseEntity<DishResponse> getDishById(@PathVariable String dishId) throws DataExitsException {
        return ResponseEntity.ok(dishService.getDishById(dishId));
    }

    @GetMapping("/get-all-dishes")
    @Operation(summary = "Get all dishes", tags = {"Dish"})
    public ResponseEntity<PagedModel<EntityModel<DishResponse>>> getAllDishes(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "dishName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(dishService.getAllDishes(pageNo, pageSize, sortBy, sortDir));
    }

    // category
    @GetMapping("/get-all-categories-name")
    @Operation(summary = "Get all category names", tags = {"Category"})
    public ResponseEntity<List<GetCategoriesNameResponse>> getAllCategoriesName() throws DataExitsException {
        return ResponseEntity.ok(categoryService.getAllCategoriesName());
    }

    @GetMapping("/get-all-categories")
    @Operation(summary = "Get all categories", tags = {"Category"})
    public ResponseEntity<PagedModel<EntityModel<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(categoryService.getAllCategories(pageNo, pageSize, sortBy, sortDir));
    }

    // coupon
    @GetMapping("/get-coupon/{code}")
    @Operation(summary = "Get coupon by code", tags = {"Coupon"})
    public ResponseEntity<CouponResponse> getCouponByCode(@RequestParam String code) throws DataExitsException {
        return ResponseEntity.ok(couponService.getCouponByCode(code));
    }

    @GetMapping("/get-all-coupons")
    @Operation(summary = "Get all coupons", tags = {"Coupon"})
    public ResponseEntity<PagedModel<EntityModel<CouponResponse>>> getAllCoupons(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(couponService.getAllCoupons(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/check-coupon-usage")
    @Operation(summary = "Check coupon usage by code and user ID", tags = {"Coupon"})
    public ResponseEntity<ApiResponse> checkCouponUsageByCodeAndUserId(
            @RequestParam String code,
            @RequestParam String userId) throws DataExitsException {
        return ResponseEntity.ok(couponService.checkCouponUsageByCodeAndUserId(code, userId));
    }

    @GetMapping("/get-all-coupons-not-used-by-user")
    @Operation(summary = "Get all coupons not used by user ID", tags = {"Coupon"})
    public ResponseEntity<PagedModel<EntityModel<CouponResponse>>> getAllCouponsNotUsedByUserId(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(couponService.getAllCouponsNotUsedByUserId(userId, pageNo, pageSize, sortBy, sortDir));
    }

    // offer
    @GetMapping("/get-all-offers")
    @Operation(summary = "Get all offers", tags = {"Offer"})
    public ResponseEntity<PagedModel<EntityModel<OfferResponse>>> getAllOffers(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(offerService.getAllOffers(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-offer-by-id")
    @Operation(summary = "Get offer by ID", tags = {"Offer"})
    public ResponseEntity<OfferResponse> getOfferById(@RequestParam String id) throws DataExitsException {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    // blogs
    @GetMapping("/blog/search-blog-by-title")
    @Operation(summary = "Search blog by title")
    public ResponseEntity<List<BlogResponse>> searchBlogByTitle(@RequestParam String title) throws DataExitsException {
        return ResponseEntity.ok(blogService.searchBlogByTitle(title));
    }

    @GetMapping("/blog/get-all-blog-to-search")
    @Operation(summary = "Get all blog to search")
    public ResponseEntity<List<SearchBlogResponse>> getAllBlogToSearch() throws DataExitsException {
        return ResponseEntity.ok(blogService.getAllBlogToSearch());
    }

    @GetMapping("/blog/get-all-tags")
    @Operation(summary = "Get all tags")
    public ResponseEntity<List<String>> getAllTags(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "tag_count") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir)
            throws DataExitsException {
        return ResponseEntity.ok(blogService.getAllTags(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/blog/get-all-blogs-by-tags")
    @Operation(summary = "Get all blogs by tags")
    public ResponseEntity<PagedModel<EntityModel<BlogResponse>>>
    getAllBlogsByTags(
            @RequestParam String tag,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(blogService.getAllBlogsByTags(tag, pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-all-blogs")
    @Operation(summary = "Get all blogs")
    public ResponseEntity<PagedModel<EntityModel<BlogResponse>>> getAllBlogs(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(blogService.getAllBlogs(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-blog-by-id")
    @Operation(summary = "Get blog by ID")
    public ResponseEntity<BlogResponse> getBlogById(@RequestParam String blogId) throws DataExitsException {
        return ResponseEntity.ok(blogService.getBlogById(blogId));
    }

    @GetMapping("/get-blog-by-slug")
    @Operation(summary = "Get blog by slug")
    public ResponseEntity<BlogResponse> getBlogBySlug(@RequestParam String slug) throws DataExitsException {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    // category blogs

    @GetMapping("/category-blog/get-all-categories-blog")
    @Operation(summary = "Get all category blogs", tags = {"CategoryBlog"})
    public ResponseEntity<?> getAllCategoryBlog(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.getAllCategoryBlog(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/category-blog/get-all-categories-blog-name")
    @Operation(summary = "Get all category blog names", tags = {"CategoryBlog"})
    public ResponseEntity<?> getAllCategoriesBlogName() throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.getAllCategoryBlogName());
    }

    @GetMapping("/category-blog/get-category-blog-by-id")
    @Operation(summary = "Get category blog by ID", tags = {"CategoryBlog"})
    public ResponseEntity<?> getCategoryBlogById(
            @RequestParam String categoryBlogId) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.getCategoryBlogById(categoryBlogId));
    }

    // comments blog
    @GetMapping("/comment/get-all-comments-by-blog-id")
    @Operation(summary = "Get all comments by blog ID", tags = {"Comment"})
    public ResponseEntity<?> getAllCommentsByBlogId(
            @RequestParam String blogId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(commentService.getAllCommentsByBlogId(blogId, pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/comment/get-comment-by-id")
    @Operation(summary = "Get comment by ID", tags = {"Comment"})
    public ResponseEntity<?> getCommentById(
            @RequestParam String commentId) throws DataExitsException {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    @GetMapping("/comment/get-all-comments")
    @Operation(summary = "Get all comments", tags = {"Comment"})
    public ResponseEntity<?> getAllComments(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(commentService.getAllComments(pageNo, pageSize, sortBy, sortDir));
    }
}
