package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.CategoryRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.payloads.responses.GetCategoriesNameResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CategoryService {

    List<GetCategoriesNameResponse> getAllCategoriesName() throws DataExitsException;

    PagedModel<EntityModel<CategoryResponse>> getAllCategories(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    CategoryResponse getCategoryById(String id) throws DataExitsException;

    ApiResponse addCategory(CategoryDto categoryDto) throws DataExitsException;

    ApiResponse updateThumbnail(MultipartFile file, String id) throws DataExitsException, IOException;

    ApiResponse updateCategory(CategoryRequest request) throws DataExitsException;

    ApiResponse deleteCategory(String id) throws DataExitsException;
}
