package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetUserResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface AdminService {

    ApiResponse addNewUser(SignUpRequest signUpRequest) throws DataExitsException;

//    Page<GetUserResponse> getAllUsers(int pageNo, int pageSize) throws DataExitsException;

    PagedModel<EntityModel<GetUserResponse>> getAllUsers(int pageNo, int pageSize) throws DataExitsException;

    ApiResponse deleteUser(String id) throws DataExitsException;

    ApiResponse updateUser(UserRequest userRequest) throws DataExitsException;
}
