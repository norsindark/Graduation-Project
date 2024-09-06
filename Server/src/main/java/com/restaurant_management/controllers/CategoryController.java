package com.restaurant_management.controllers;

import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.services.interfaces.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Category")
@RequestMapping("/api/v1/category")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<Page<CategoryResponse>> getAllCategories(
            @RequestParam int pageNo,
            @RequestParam int pageSize,
            @RequestParam String sortBy) throws DataExitsException {
        return ResponseEntity.ok(categoryService.getAllCategories(pageNo, pageSize, sortBy));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> addCategory(@RequestBody CategoryDto categoryDto) throws DataExitsException {
        return ResponseEntity.ok(categoryService.addCategory(categoryDto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> updateCategory(@RequestBody CategoryDto categoryDto) throws DataExitsException {
        return ResponseEntity.ok(categoryService.updateCategory(categoryDto));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
