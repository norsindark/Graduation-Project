package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.UserDto;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.PasswordRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface UserService {

//    Optional<UserProfileResponse>  getUserByAccessToken() throws UserNotFoundException;

    Optional<User> getUserByAccessToken() throws DataExitsException;

    ApiResponse updateUserProfile(UserDto userDto) throws DataExitsException;
//
    ApiResponse updateAvatar(MultipartFile file) throws DataExitsException, IOException;

    ApiResponse changePassword(PasswordRequest request) throws DataExitsException;

    ApiResponse deleteUser(String userId) throws DataExitsException;

//    public void logOut(HttpServletResponse response) throws DataExitsException;
}
