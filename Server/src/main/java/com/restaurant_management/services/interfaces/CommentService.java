package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.CommentDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CommentResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface CommentService {

    CommentResponse getCommentById(String id) throws DataExitsException;

    PagedModel<EntityModel<CommentResponse>> getAllComments(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    PagedModel<EntityModel<CommentResponse>> getAllCommentsByBlogId(String blogId,int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse addComment(CommentDto request) throws DataExitsException;

    ApiResponse updateComment(CommentDto request) throws DataExitsException;

    ApiResponse deleteComment(String id) throws DataExitsException;
}
