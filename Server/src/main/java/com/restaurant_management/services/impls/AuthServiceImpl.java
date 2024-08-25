package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.RoleName;
import com.restaurant_management.enums.StatusType;
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
import com.restaurant_management.services.interfaces.AuthService;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.ApiUtil;
import com.restaurant_management.utils.JwtProviderUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@Component
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticate;

    private final JwtProviderUtil jwtProviderUtil;

    private final TokenService tokenService;

    private final UserTokenRepository userTokenRepository;

    private final static String clientUrl = "http://localhost:3000/";


    @Override
    @Transactional
    public ApiResponse signUp(SignUpRequest signUpRequest) throws DataExitsException, MessagingException, UnsupportedEncodingException {
        String email = signUpRequest.getEmail();
        if (userRepository.existsByEmail(email)) {
//             throw new DataExitsException("This email: " + email + " already exist!");
             return new ApiResponse("An error:"
                                            , ApiUtil.createErrorDetails("This email: " + email + " already exist!")
                                            , HttpStatus.BAD_REQUEST);
        } else {
            Role role = roleRepository.findByName(RoleName.USER.toString());

            User _user = User.builder()
                    .fullName(signUpRequest.getFullName())
                    .email(signUpRequest.getEmail())
                    .password(passwordEncoder.encode(signUpRequest.getPassword()))
                    .status(StatusType.INACTIVE.toString())
                    .role(role)
                    .enabled(false)
                    .build();
            User savedUser = this.userRepository.save(_user);

            tokenService.createEmailVerificationToken(savedUser);

            return new ApiResponse("Account created successfully! Please check your email for verification.", HttpStatus.CREATED);
        }
    }

    @Override
    public JwtResponse signIn(SignInRequest signInRequest) throws DataExitsException {
        try {
            authenticate.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            signInRequest.getEmail(),
                            signInRequest.getPassword()
                    ));
            User _user = this.userRepository.findByEmail(signInRequest.getEmail())
                    .orElseThrow(() -> new DataExitsException("Email or password is invalid!"));

            var token = this.jwtProviderUtil.generaTokenUsingEmail(_user);
            tokenService.saveAccessToken(_user, token);
            tokenService.saveRefreshToken(_user);
            return JwtResponse.builder()
                    .accessToken(token)
                    .build();
        } catch (AuthenticationException e) {
            throw new DataExitsException("The account has not been verified!");
        }
    }

    @Override
    public ApiResponse verifyEmail(String token) {
        UserToken userToken = userTokenRepository.findByToken(token);

        if (userToken == null
                || userToken.getExpiryDate().isBefore(LocalDateTime.now())
                || userToken.getTokenType() != TokenType.EMAIL_VERIFICATION) {
            return new ApiResponse("An error",
                    ApiUtil.createErrorDetails("Invalid or expired token"),
                    HttpStatus.BAD_REQUEST);
        }

        User user = userToken.getUser();
        user.setEnabled(true);
        user.setStatus(StatusType.ACTIVE.toString());
        user.setEmailVerifiedAt(Timestamp.valueOf(LocalDateTime.now()));
        this.userRepository.save(user);

        this.userTokenRepository.delete(userToken);
        return new ApiResponse("Email verified successfully!", HttpStatus.OK);
    }

    @Override
    public ApiResponse resendVerificationEmail(String email) throws MessagingException, UnsupportedEncodingException, DataExitsException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataExitsException("Email not found!"));

        if (user.isEnabled()) {
            return new ApiResponse("An error!"
                    ,ApiUtil.createErrorDetails("This account has already been verified")
                    ,HttpStatus.BAD_REQUEST);
        }

        UserToken _userToken = userTokenRepository.findByUserAndTokenType(user, TokenType.EMAIL_VERIFICATION);
        if (_userToken != null) {
            userTokenRepository.delete(_userToken);
        }
        tokenService.createEmailVerificationToken(user);

        return new ApiResponse("Verification email sent successfully!", HttpStatus.OK);
    }

    @Override
    public ApiResponse forgotPassword(String email) throws MessagingException, UnsupportedEncodingException, DataExitsException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataExitsException("Email not found!"));

        UserToken _userToken = userTokenRepository.findByUserAndTokenType(user, TokenType.PASSWORD_RESET);
        if (_userToken != null) {
            userTokenRepository.delete(_userToken);
        }

        tokenService.createPasswordResetToken(user);

        return new ApiResponse("Password reset email sent successfully!", HttpStatus.OK);
    }

    @Override
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        UserToken userToken = userTokenRepository.findByToken(request.getToken());

        if (userToken == null
                || userToken.getExpiryDate().isBefore(LocalDateTime.now())
                || userToken.getTokenType() != TokenType.PASSWORD_RESET) {
            return new ApiResponse("An error!",
                    ApiUtil.createErrorDetails("Token is invalid or expired"),
                    HttpStatus.BAD_REQUEST);
        }

        User user = userToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        userTokenRepository.delete(userToken);

        return new ApiResponse("Password change successfully!", HttpStatus.OK);
    }
}
