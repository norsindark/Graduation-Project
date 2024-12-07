package com.restaurant_management.services;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.RoleName;
import com.restaurant_management.enums.TokenType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ResetPasswordRequest;
import com.restaurant_management.payloads.requests.SignInRequest;
import com.restaurant_management.payloads.requests.SignUpRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.impls.AuthServiceImpl;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.JwtProviderUtil;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticate;

    @Mock
    private JwtProviderUtil jwtProviderUtil;

    @Mock
    private TokenService tokenService;

    @Mock
    private UserTokenRepository userTokenRepository;

    @InjectMocks
    private AuthServiceImpl authServiceImpl;

    @Value("${restaurantManagement.app.refreshTokenExpired}")
    private int refreshTokenExpired;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignUp() throws DataExitsException, MessagingException, UnsupportedEncodingException {
        System.out.println("==> Starting testSignUp...");

        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setFullName("Test User");
        signUpRequest.setPassword("password");

        System.out.println("Step 1: Setting up mock behavior for userRepository and roleRepository...");
        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(false);
        when(roleRepository.findByName(RoleName.USER.toString())).thenReturn(new Role());
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        System.out.println("Step 2: Calling signUp method in authServiceImpl...");
        ApiResponse response = authServiceImpl.signUp(signUpRequest);

        System.out.println("Step 3: Validating the response...");
        assertEquals("Account created successfully! Please check your email for verification.", response.getMessage());
        assertEquals(HttpStatus.CREATED, response.getHttpStatus());

        System.out.println("==> testSignUp completed successfully.");
    }

    @Test
    void testSignIn() throws DataExitsException {
        System.out.println("==> Starting testSignIn...");

        SignInRequest signInRequest = new SignInRequest();
        signInRequest.setEmail("test@example.com");
        signInRequest.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setEnabled(true);

        System.out.println("Step 1: Setting up mock behavior for userRepository and jwtProviderUtil...");
        when(userRepository.findByEmail(signInRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtProviderUtil.generaTokenUsingEmail(user)).thenReturn("token");
        when(jwtProviderUtil.generaRefreshTokenUsingEmail(user)).thenReturn("refreshToken");

        HttpServletResponse response = mock(HttpServletResponse.class);

        System.out.println("Step 2: Calling signIn method in authServiceImpl...");
        JwtResponse jwtResponse = authServiceImpl.signIn(signInRequest, response);

        System.out.println("Step 3: Validating the response...");
        assertEquals("token", jwtResponse.getAccessToken());

        System.out.println("==> testSignIn completed successfully.");
    }


    @Test
    void testVerifyEmail() throws DataExitsException {
        UserToken userToken = new UserToken();
        userToken.setExpiryDate(LocalDateTime.now().plusDays(1));
        userToken.setTokenType(TokenType.EMAIL_VERIFICATION);
        User user = new User();
        userToken.setUser(user);

        when(userTokenRepository.findByToken("token")).thenReturn(userToken);

        ApiResponse response = authServiceImpl.verifyEmail("token");

        assertEquals("Email verified successfully!", response.getMessage());
        assertEquals(HttpStatus.OK, response.getHttpStatus());
    }

    @Test
    void testResendVerificationEmail() throws MessagingException, UnsupportedEncodingException, DataExitsException {
        User user = new User();
        user.setEmail("test@example.com");
        user.setEnabled(false);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userTokenRepository.findByUserAndTokenType(user, TokenType.EMAIL_VERIFICATION)).thenReturn(null);

        ApiResponse response = authServiceImpl.resendVerificationEmail("test@example.com");

        assertEquals("Verification email sent successfully!", response.getMessage());
        assertEquals(HttpStatus.OK, response.getHttpStatus());
    }

    @Test
    void testForgotPassword() throws MessagingException, UnsupportedEncodingException, DataExitsException {
        User user = new User();
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userTokenRepository.findByUserAndTokenType(user, TokenType.PASSWORD_RESET)).thenReturn(null);

        ApiResponse response = authServiceImpl.forgotPassword("test@example.com");

        assertEquals("Password reset email sent successfully!", response.getMessage());
        assertEquals(HttpStatus.OK, response.getHttpStatus());
    }

    @Test
    void testResetPassword() throws DataExitsException {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("token");
        request.setPassword("newPassword");

        UserToken userToken = new UserToken();
        userToken.setExpiryDate(LocalDateTime.now().plusDays(1));
        userToken.setTokenType(TokenType.PASSWORD_RESET);
        User user = new User();
        userToken.setUser(user);

        when(userTokenRepository.findByToken(request.getToken())).thenReturn(userToken);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");

        ApiResponse response = authServiceImpl.resetPassword(request);

        assertEquals("Password change successfully!", response.getMessage());
        assertEquals(HttpStatus.OK, response.getHttpStatus());
    }
}
