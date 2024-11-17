package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.CategoryBlogRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryBlogResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CategoryBlogService {
    List<Map<String, String>> getAllCategoryBlogName() throws DataExitsException;

    CategoryBlogResponse getCategoryBlogById(String categoryBlogId) throws DataExitsException;

    PagedModel<EntityModel<CategoryBlogResponse>> getAllCategoryBlog(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse createCategoryBlog(CategoryBlogRequest request) throws DataExitsException;

    ApiResponse updateCategoryBlog(CategoryBlogRequest request) throws DataExitsException;

    ApiResponse updateThumbnail(MultipartFile file, String CategoryBlogId) throws DataExitsException, IOException;

    ApiResponse deleteCategoryBlog(String categoryBlogId) throws DataExitsException;
}
