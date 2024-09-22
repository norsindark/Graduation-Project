package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetUserResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.text.ParseException;
import java.util.Optional;

public interface AdminService {

    ApiResponse addNewUser(SignUpRequest signUpRequest) throws DataExitsException;

    PagedModel<EntityModel<GetUserResponse>> getAllUsers(int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException;

    Optional<UserResponse> getUserById(String id) throws DataExitsException;

    ApiResponse deleteUser(String id) throws DataExitsException;

    ApiResponse updateUser(UserRequest userRequest) throws DataExitsException;

    PagedModel<EntityModel<GetUserResponse>> searchUsers(String type,String keyword, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException, ParseException;
}
