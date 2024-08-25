package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {

    Page<CategoryResponse> getAllCategories(int pageNo, int pageSize, String sortBy)
            throws DataExitsException;

    ApiResponse addCategory(CategoryDto categoryDto) throws DataExitsException;

    ApiResponse updateCategory(CategoryDto categoryDto) throws DataExitsException;

    ApiResponse deleteCategory(String id) throws DataExitsException;
}
