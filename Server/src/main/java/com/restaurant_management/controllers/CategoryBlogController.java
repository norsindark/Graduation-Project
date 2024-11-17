package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.CategoryBlogRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.payloads.responses.GetCategoriesNameResponse;
import com.restaurant_management.services.interfaces.CategoryBlogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequiredArgsConstructor
@Tag(name = "CategoryBlog", description = "Category Blog API")
@RequestMapping("/api/v1/dashboard/category-blog")
public class CategoryBlogController {
    private final CategoryBlogService categoryBlogService;

    @GetMapping("/get-all-categories-name")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> getAllCategoriesName() throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.getAllCategoryBlogName());
    }

    @GetMapping("/get-category-blog-by-id")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> getCategoryBlogById(@RequestParam String categoryBlogId) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.getCategoryBlogById(categoryBlogId));
    }

    @GetMapping("/get-all-categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> getAllCategories(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.getAllCategoryBlog(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-new-category-blog")
    public ResponseEntity<ApiResponse> addCategoryBlog(@RequestBody CategoryBlogRequest request) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.createCategoryBlog(request));
    }

    @PutMapping("/update-category-blog")
    public ResponseEntity<ApiResponse> updateCategoryBlog(@RequestBody CategoryBlogRequest request) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.updateCategoryBlog(request));
    }

    @PutMapping("/update-thumbnail")
    public ResponseEntity<ApiResponse> updateThumbnail(
            @RequestParam String categoryBlogId,
            @RequestBody MultipartFile file
            ) throws DataExitsException, IOException {
        return ResponseEntity.ok(categoryBlogService.updateThumbnail(file, categoryBlogId));
    }

    @DeleteMapping("/delete-category-blog")
    public ResponseEntity<ApiResponse> deleteCategoryBlog(@RequestParam String categoryBlogId) throws DataExitsException {
        return ResponseEntity.ok(categoryBlogService.deleteCategoryBlog(categoryBlogId));
    }
}
