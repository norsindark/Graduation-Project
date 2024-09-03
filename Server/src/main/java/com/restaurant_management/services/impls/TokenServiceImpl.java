package com.restaurant_management.services.impls;

import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.TokenType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.RefreshTokenResponse;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.EmailService;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.JwtProviderUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Component
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final UserTokenRepository userTokenRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final JwtProviderUtil jwtProviderUtil;

    private final UserDetailsService userDetailsService;

    @Value("${RestaurantManagement.app.jwtSecret}")
    private String SECRET_KEY;

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
    public RefreshTokenResponse refreshAccessToken(HttpServletRequest request) throws DataExitsException {
        try {
            var refreshToken = "";
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                    }
                }
            }

            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(refreshToken);
            String username = claims.getBody().getSubject();
            User _user = (User) userDetailsService.loadUserByUsername(username);

            String newAccessToken = jwtProviderUtil.generaTokenUsingEmail(_user);
            var _refreshToken = jwtProviderUtil.generaRefreshTokenUsingEmail(_user);

            return RefreshTokenResponse.builder()
                    .accessToken(newAccessToken)
                    .build();
        } catch (ExpiredJwtException e) {
            throw new DataExitsException("Refresh token is expired");
        }
    }
}