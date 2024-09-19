package com.restaurant_management.controllers;

import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.services.interfaces.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Category")
@RequestMapping("/api/v1/dashboard/category")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<PagedModel<EntityModel<CategoryResponse>>> getAllCategories(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(categoryService.getAllCategories(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-by-id/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping("/add-category")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> addCategory(@RequestBody CategoryDto categoryDto) throws DataExitsException {
        return ResponseEntity.ok(categoryService.addCategory(categoryDto));
    }

    @PutMapping("/update-category")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> updateCategory(@RequestBody CategoryDto categoryDto) throws DataExitsException {
        return ResponseEntity.ok(categoryService.updateCategory(categoryDto));
    }

    @PutMapping("/update-category-thumbnail/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> updateCategoryImage(@PathVariable String id,
                                                 @RequestParam("file") MultipartFile file)
            throws DataExitsException, IOException {
        return ResponseEntity.ok(categoryService.updateThumbnail(file, id));
    }

    @DeleteMapping("/delete-category/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
