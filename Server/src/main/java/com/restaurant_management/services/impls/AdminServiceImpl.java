package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.requests.UserRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetUserResponse;
import com.restaurant_management.payloads.responses.UserResponse;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.AdminService;
import com.restaurant_management.utils.TimestampConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Component
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserTokenRepository userTokenRepository;

    private final PagedResourcesAssembler<GetUserResponse> pagedResourcesAssembler;

    private final PasswordEncoder encoder;


    @Override
    public ApiResponse addNewUser(SignUpRequest signUpRequest) throws DataExitsException {
        Optional<User> user = userRepository.findByEmail(signUpRequest.getEmail());

        if (user.isPresent()) {
            throw new DataExitsException("User already exists!");
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
    public PagedModel<EntityModel<GetUserResponse>> getAllUsers(int pageNo, int pageSize, String sort, String sortDir) throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sort));
        Page<User> users = userRepository.findAllUser(pageable);
        if (users.isEmpty()) {
            throw new DataExitsException("No user found!");
        }
        Page<GetUserResponse> userResponses = users.map(GetUserResponse::new);
        return pagedResourcesAssembler.toModel(userResponses);
    }

    @Override
    public Optional<UserResponse> getUserById(String id) throws DataExitsException {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found!");
        }

        User userEntity = user.get();

        Set<Address> addresses = new HashSet<>();
        if (!userEntity.getAddresses().isEmpty()) {
            addresses.addAll(userEntity.getAddresses());
        }

        UserResponse userProfileResponse = new UserResponse(
                userEntity.getId(),
                userEntity.getEmail(),
                userEntity.getFullName(),
                userEntity.getAvatar(),
                userEntity.getRole(),
                addresses
        );

        return Optional.of(userProfileResponse);
    }

    @Override
    public ApiResponse deleteUser(String id) throws DataExitsException {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found!");
        }
        this.userTokenRepository.deleteByUserId(id);
        userRepository.delete(user.get());
        return new ApiResponse("User deleted successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse updateUser(UserRequest userRequest) throws DataExitsException {
        Optional<User> user = userRepository.findById(userRequest.getId());
        if (user.isEmpty()) {
            throw new DataExitsException("User not found!");
        }
        Role role = roleRepository.findByName(userRequest.getRole());

        user.get().setRole(role);
        user.get().setStatus(StatusType.valueOf(userRequest.getStatus()).toString());

        this.userRepository.save(user.get());

        return new ApiResponse("User updated successfully", HttpStatus.OK);
    }

    @Override
    public PagedModel<EntityModel<GetUserResponse>> searchUsers(String type, String keyword, int pageNo, int pageSize, String sort, String sortDir)
            throws DataExitsException, ParseException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sort));
        Page<User> userPage = switch (type.toLowerCase(Locale.ROOT)) {
            case "email" -> userRepository.findsByEmail(keyword, pageable);
            case "fullname" -> userRepository.findByFullName(keyword, pageable);
            case "role" -> userRepository.findByRoleId(keyword, pageable);
            case "status" -> userRepository.findByStatus(keyword, pageable);
            case "enabled" -> userRepository.findByEnabled(Boolean.parseBoolean(keyword), pageable);
            case "emailverifiedat" -> userRepository.findByEmailVerifiedAt(TimestampConverter.convertStringToTimestamp(keyword), pageable);
            case "createdat" -> userRepository.findByCreatedAt(TimestampConverter.convertStringToTimestamp(keyword), pageable);
            case "updatedat" -> userRepository.findByUpdatedAt(TimestampConverter.convertStringToTimestamp(keyword), pageable);
            default -> throw new DataExitsException("Invalid search type");
        };

        if (userPage.isEmpty()) {
            throw new DataExitsException("No user found!");
        }

        if (userPage.hasContent()) {
            return pagedResourcesAssembler.toModel(userPage.map(GetUserResponse::new));
        } else {
            throw new DataExitsException("No Category found");
        }
    }

}
