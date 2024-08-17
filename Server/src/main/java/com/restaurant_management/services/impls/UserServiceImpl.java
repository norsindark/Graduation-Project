package com.restaurant_management.services.impls;

import com.cloudinary.Cloudinary;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.UserNotFoundException;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.UserService;
import com.restaurant_management.utils.GetUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserTokenRepository userTokenRepository;

    private final Cloudinary cloudinary;

//    @Override
//    public Optional<UserProfileResponse> getUserByAccessToken() throws UserNotFoundException {
//
//        GetUserUtil userUtil = new GetUserUtil();
//        String username = userUtil.getUserEmail();
//        Optional<User> user = this.userRepository.findByEmail(username);
//        if (user.isEmpty()) {
//            throw new UserNotFoundException("User not found with: " + username);
//        }
//        UserProfileResponse userProfileResponse = new UserProfileResponse(
//                user.get().getEmail(),
//                user.get().getFullName(),
//                user.get().getAvatar(),
//                user.get().getAddresses()
//        );
//
//        return Optional.of(userProfileResponse);
//    }

    @Override
    public Optional<User> getUserByAccessToken() throws UserNotFoundException {
        GetUserUtil userUtil = new GetUserUtil();
        String username = userUtil.getUserEmail();
        Optional<User> user = this.userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found with: " + username);
        }
        return user;
    }

//    @Override
//    public ApiResponse updateUserProfile(UserDto userDto) throws UserNotFoundException {
//        GetUserUtil userUtil = new GetUserUtil();
//        String username = userUtil.getUserEmail();
//        Optional<User> user = this.userRepository.findByEmail(username);
//        if (user.isEmpty()) {
//            throw new UserNotFoundException("User not found with: " + username);
//        }
//        user.get().setFullName(userDto.getFullName());
//        this.userRepository.save(user.get());
//        return new ApiResponse("Update user profile successfully", HttpStatus.OK);
//    }
//
//    @Override
//    public ApiResponse updateAvatar(MultipartFile file) throws UserNotFoundException, IOException {
//        GetUserUtil userUtil = new GetUserUtil();
//        String username = userUtil.getUserEmail();
//        Optional<User> user = this.userRepository.findByEmail(username);
//        if (user.isEmpty()) {
//            throw new UserNotFoundException("User not found with: " + username);
//        }
//
//        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
//        String imageUrl = (String) uploadResult.get("url");
//
//        User _user = user.get();
//        _user.setAvatar(imageUrl);
//        this.userRepository.save(_user);
//        return new ApiResponse("Image updated successfully!", HttpStatus.OK);
//    }
}
