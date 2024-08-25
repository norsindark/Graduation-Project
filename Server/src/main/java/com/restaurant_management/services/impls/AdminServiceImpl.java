package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.AdminService;
import com.restaurant_management.utils.ApiUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Component
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserTokenRepository userTokenRepository;

    private final PasswordEncoder encoder;


    @Override
    public ApiResponse addNewUser(SignUpRequest signUpRequest) {
        Optional<User> user = userRepository.findByEmail(signUpRequest.getEmail());

        if (user.isPresent()) {
            return new ApiResponse("An error:"
                    , ApiUtil.createErrorDetails("This email: " + signUpRequest.getEmail() + " already exist!")
                    , HttpStatus.BAD_REQUEST);
        }
        Role role = roleRepository.findByName(signUpRequest.getRole());

        User newUser = User.builder()
                .email(signUpRequest.getEmail())
                .fullName(signUpRequest.getFullName())
                .role(role)
                .enabled(true)
                .status(StatusType.ACTIVE.toString())
                .emailVerifiedAt(Timestamp.valueOf(LocalDateTime.now()))
                .password(encoder.encode(signUpRequest.getPassword()))
                .build();
        userRepository.save(newUser);
        return new ApiResponse("User added successfully", HttpStatus.CREATED);
    }

    @Override
    public Page<UserResponse> getAllUsers(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<User> users = userRepository.findAllUser(pageable);
        return users.map(UserResponse::new);
    }

    @Override
    public ApiResponse deleteUser(String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            this.userTokenRepository.deleteByUserId(id);
            userRepository.delete(user.get());
            return new ApiResponse("User deleted successfully", HttpStatus.OK);
        }
        return new ApiResponse("User not found", HttpStatus.NOT_FOUND);
    }

    @Override
    public ApiResponse updateUser(UserRequest userRequest) {
        Optional<User> user = userRepository.findById(userRequest.getId());
        if (user.isPresent()) {
            Role role = roleRepository.findByName(userRequest.getRole());

            user.get().setRole(role);
            user.get().setFullName(userRequest.getFullName());
            user.get().setEmail(userRequest.getEmail());
            user.get().setStatus(StatusType.valueOf(userRequest.getStatus()).toString());

            this.userRepository.save(user.get());

            return new ApiResponse("User updated successfully", HttpStatus.OK);
        }
        return new ApiResponse("An error:",ApiUtil.createErrorDetails("User not found!"), HttpStatus.NOT_FOUND);
    }
}