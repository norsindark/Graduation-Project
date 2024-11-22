package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.BlogDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.BlogResponse;
import com.restaurant_management.payloads.responses.SearchBlogResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BlogService {
    BlogResponse getBlogById(String blogId) throws DataExitsException;

    BlogResponse getBlogBySlug(String slug) throws DataExitsException;

    PagedModel<EntityModel<BlogResponse>> getAllBlogs(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    ApiResponse createBlog(BlogDto blogDto) throws DataExitsException;

    ApiResponse updateBlog(BlogDto blogDto) throws DataExitsException;

    ApiResponse createBlogThumbnailUrl(MultipartFile file) throws DataExitsException, IOException;

    ApiResponse deleteBlog(String blogId) throws DataExitsException;

    List<BlogResponse> searchBlogByTitle(String title) throws DataExitsException;

    List<SearchBlogResponse> getAllBlogToSearch() throws DataExitsException;

    List<String> getAllTags() throws DataExitsException;

//    List<BlogResponse> getAllBlogsByTags(List<String> tag) throws DataExitsException;
    PagedModel<EntityModel<BlogResponse>> getAllBlogsByTags(
            List<String> tags, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
}
