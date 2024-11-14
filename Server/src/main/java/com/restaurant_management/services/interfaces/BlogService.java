package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.BlogDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.BlogResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface BlogService {
    BlogResponse getBlogById(String blogId) throws DataExitsException;

    PagedModel<EntityModel<BlogResponse>> getAllBlogs(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    ApiResponse createBlog(BlogDto blogDto) throws DataExitsException;

    ApiResponse updateBlog(BlogDto blogDto) throws DataExitsException;

    ApiResponse deleteBlog(String blogId) throws DataExitsException;
}
