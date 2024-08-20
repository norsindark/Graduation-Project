package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.enums.RoleName;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.OAuthService;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.JwtProviderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class OAuthServiceImpl implements OAuthService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtProviderUtil jwtProviderUtil;

    private final TokenService tokenService;


    private final OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public ApiResponse handleOAuth2Callback(OAuth2User oAuth2User) {
        String emailUser = oAuth2User.getAttribute("email");

        System.out.println("User Email: " + oAuth2User.getAttribute("email"));
        System.out.println("User Name: " + oAuth2User.getAttribute("name"));


        User user = userRepository.findByEmail(emailUser)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(emailUser);
                    newUser.setFullName(oAuth2User.getAttribute("name"));
                    newUser.setEnabled(true);
                    newUser.setEmailVerifiedAt(Timestamp.valueOf(LocalDateTime.now()));
                    Role role = roleRepository.findByName(RoleName.USER.toString());
                    newUser.setRole(role);
                    newUser.setPassword(passwordEncoder.encode("defaultPassword"));
                    return userRepository.save(newUser);
                });

        return new ApiResponse("Login successfully!", HttpStatus.OK);
    }
}
