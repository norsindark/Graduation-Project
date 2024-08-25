package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import org.springframework.data.domain.Page;

public interface AdminService {

    ApiResponse addNewUser(SignUpRequest signUpRequest);

    Page<UserResponse> getAllUsers(int pageNo, int pageSize);

    ApiResponse deleteUser(String id);

    ApiResponse updateUser(UserRequest userRequest);
}