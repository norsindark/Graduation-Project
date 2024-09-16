package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface CategoryService {

    PagedModel<EntityModel<CategoryResponse>> getAllCategories(int pageNo, int pageSize, String sortBy)
            throws DataExitsException;

    CategoryResponse getCategoryById(String id) throws DataExitsException;

    ApiResponse addCategory(CategoryDto categoryDto) throws DataExitsException;

    ApiResponse updateCategory(CategoryDto categoryDto) throws DataExitsException;

    ApiResponse deleteCategory(String id) throws DataExitsException;
}
