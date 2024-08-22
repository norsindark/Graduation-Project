package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.enums.RoleName;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.OAuthService;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.JwtProviderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@Component
@RequiredArgsConstructor
public class OAuthServiceImpl implements OAuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtProviderUtil jwtProviderUtil;

    private final TokenService tokenService;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public JwtResponse handleOAuth2Callback(String code, String state){
        String accessToken = getAccessToken(code);
        String email = getUserEmailFromAccessToken(accessToken);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            String fullName = email.substring(0, email.indexOf('@'));
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setEnabled(true);
            newUser.setEmailVerifiedAt(Timestamp.valueOf(LocalDateTime.now()));
            Role role = roleRepository.findByName(RoleName.USER.toString());
            newUser.setRole(role);
            newUser.setPassword(passwordEncoder.encode("defaultPassword"));
            return userRepository.save(newUser);
        });

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        var token = jwtProviderUtil.generaTokenUsingEmail(user);
        tokenService.saveAccessToken(user, token);
        tokenService.saveRefreshToken(user);

        return JwtResponse.builder()
                .accessToken(token)
                .build();
    }

    private String getAccessToken(String code) {
        String tokenUrl = "https://oauth2.googleapis.com/token";
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, body, Map.class);
        return (String) response.getBody().get("access_token");
    }

    private String getUserEmailFromAccessToken(String accessToken) {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
        ResponseEntity<Map> response = restTemplate.getForEntity(userInfoUrl, Map.class);
        return (String) response.getBody().get("email");
    }

}
