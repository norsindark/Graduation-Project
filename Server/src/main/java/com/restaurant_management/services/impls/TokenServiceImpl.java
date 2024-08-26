package com.restaurant_management.services.impls;

import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.TokenType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.RefreshTokenRequest;
import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.EmailService;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.GetUserUtil;
import com.restaurant_management.utils.JwtProviderUtil;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Component
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final UserTokenRepository userTokenRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final JwtProviderUtil jwtProviderUtil;

    @Value("${restaurantManagement.app.refreshTokenExpired}")
    private int refreshTokenExpired;

    @Override
    public void createEmailVerificationToken(User user) throws MessagingException, UnsupportedEncodingException {
        UserToken token = new UserToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(1));
        token.setTokenType(TokenType.EMAIL_VERIFICATION);
        userTokenRepository.save(token);

        emailService.sendVerificationEmail(user.getEmail(), token.getToken());
    }

    @Override
    public void createPasswordResetToken(User user) throws MessagingException, UnsupportedEncodingException {
        UserToken token = new UserToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(1));
        token.setTokenType(TokenType.PASSWORD_RESET);
        userTokenRepository.save(token);

        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
    }



    @Override
    public JwtResponse refreshAccessToken(RefreshTokenRequest refreshToken, HttpServletResponse response) throws DataExitsException {
        UserToken userToken = userTokenRepository.findByToken(refreshToken.getRefreshToken());

        if (userToken == null
                || userToken.getExpiryDate().isBefore(LocalDateTime.now())
                || userToken.getTokenType() != TokenType.REFRESH_TOKEN) {
            throw new DataExitsException("Invalid or expired refresh token");
        }

        User _user = userToken.getUser();
        String newAccessToken = jwtProviderUtil.generaTokenUsingEmail(_user);
        var _refreshToken = jwtProviderUtil.generaRefreshTokenUsingEmail(_user);

        Cookie refreshTokenCookie = new Cookie("refreshToken", _refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenExpired);
        response.addCookie(refreshTokenCookie);

        return JwtResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }

//    @Override
//    public UserToken generaRefreshToken(User user) {
//        UserToken _refreshToken = userTokenRepository.findByUserAndTokenType(user, TokenType.REFRESH_TOKEN);
//        if (_refreshToken != null) {
//            userTokenRepository.delete(_refreshToken);
//        }
//
//        UserToken refreshToken = new UserToken();
//        refreshToken.setToken(UUID.randomUUID().toString());
//        refreshToken.setUser(user);
//        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
//        refreshToken.setTokenType(TokenType.REFRESH_TOKEN);
//        userTokenRepository.save(refreshToken);
//        return refreshToken;
//    }

//    @Override
//    public void saveAccessToken(User user, String token) {
//        UserToken _accessToken = userTokenRepository.findByUserAndTokenType(user, TokenType.ACCESS_TOKEN);
//        if (_accessToken != null) {
//            userTokenRepository.delete(_accessToken);
//        }
//
//        UserToken accessToken = new UserToken();
//        accessToken.setToken(token);
//        accessToken.setUser(user);
//        accessToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
//        accessToken.setTokenType(TokenType.ACCESS_TOKEN);
//        userTokenRepository.save(accessToken);
//    }

    @Override
    public void invokerRefreshToken() {
        GetUserUtil getUserUtil = new GetUserUtil();
        String userEmail = getUserUtil.getUserEmail();
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isEmpty()) {
            return;
        }
        UserToken userToken = userTokenRepository.findByUserAndTokenType(user.get(),TokenType.REFRESH_TOKEN);
        if (userToken != null) {
            userTokenRepository.delete(userToken);
        }
    }
}
