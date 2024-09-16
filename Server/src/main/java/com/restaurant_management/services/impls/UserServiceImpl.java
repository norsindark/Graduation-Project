package com.restaurant_management.services.impls;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.restaurant_management.dtos.UserDto;
import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.PasswordRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.UserService;
import com.restaurant_management.utils.GetUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserTokenRepository userTokenRepository;

    private final PasswordEncoder encoder;

    private final Cloudinary cloudinary;

    @Override
    public Optional<UserResponse> getUserByAccessToken() throws DataExitsException {

        GetUserUtil userUtil = new GetUserUtil();
        String username = userUtil.getUserEmail();
        Optional<User> user = this.userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found with: " + username);
        }
        UserResponse userProfileResponse = new UserResponse(
                user.get().getId(),
                user.get().getEmail(),
                user.get().getFullName(),
                user.get().getAvatar(),
                user.get().getRole(),
                user.get().getAddresses().isEmpty() ? null : new HashSet<>(user.get().getAddresses())
        );
        return Optional.of(userProfileResponse);
    }

    @Override
    public ApiResponse updateUserProfile(UserDto userDto) throws DataExitsException {
        GetUserUtil userUtil = new GetUserUtil();
        String username = userUtil.getUserEmail();
        Optional<User> user = this.userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found with: " + username);
        }
        User _user = user.get();
        _user.setFullName(userDto.getFullName());
        _user.setEmail(userDto.getEmail());

        this.userRepository.save(user.get());
        return new ApiResponse("Update user profile successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse updateAvatar(MultipartFile file) throws DataExitsException, IOException {
        GetUserUtil userUtil = new GetUserUtil();
        String username = userUtil.getUserEmail();
        Optional<User> user = this.userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found with: " + username);
        }

        var uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("url");

        User _user = user.get();
        _user.setAvatar(imageUrl);
        this.userRepository.save(_user);
        return new ApiResponse(imageUrl, HttpStatus.OK);
    }

    @Override
    public ApiResponse changePassword(PasswordRequest request) throws DataExitsException {
        Optional<User> user = this.userRepository.findById(request.getUserId());
        if (user.isEmpty()) {
            throw new DataExitsException("User not found with: " + request.getUserId());
        }

        if (!encoder.matches(request.getOldPassword(), user.get().getPassword())) {
           throw new DataExitsException("Old password is incorrect");
        }

        User _user = user.get();
        _user.setPassword(encoder.encode(request.getNewPassword()));
        this.userRepository.save(_user);
        return new ApiResponse("Password change successfully!", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteUser(String userId) throws DataExitsException {
        Optional<User> user = this.userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found!");
        }
        List<UserToken> userTokens = this.userTokenRepository.findByUserId(userId);

        System.out.println("User token: " + userTokens);

        if (!userTokens.isEmpty()) {
            this.userTokenRepository.deleteByUserId(userId);
        }

        this.userRepository.deleteById(userId);
        return new ApiResponse("User deleted successfully", HttpStatus.OK);
    }
}
