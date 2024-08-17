package com.restaurant_management.services.interfaces;

import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.UserNotFoundException;

import java.util.Optional;

public interface UserService {

//    Optional<UserProfileResponse>  getUserByAccessToken() throws UserNotFoundException;

    Optional<User> getUserByAccessToken() throws UserNotFoundException;

//    ApiResponse updateUserProfile(UserDto userDto) throws UserNotFoundException;
//
//    ApiResponse updateAvatar(MultipartFile file) throws UserNotFoundException, IOException;
}
