package com.restaurant_management.services.impls;

import com.restaurant_management.entites.User;
import com.restaurant_management.entites.UserToken;
import com.restaurant_management.enums.TokenType;
import com.restaurant_management.exceptions.InvalidTokenException;
import com.restaurant_management.payloads.requests.RefreshTokenRequest;
import com.restaurant_management.payloads.responses.JwtResponse;
import com.restaurant_management.repositories.UserTokenRepository;
import com.restaurant_management.services.interfaces.EmailService;
import com.restaurant_management.services.interfaces.TokenService;
import com.restaurant_management.utils.JwtProviderUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
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

    private final EmailService emailService;

    private final JwtProviderUtil jwtProviderUtil;

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
    public void saveRefreshToken(User user) {
        UserToken refreshToken = new UserToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshToken.setTokenType(TokenType.REFRESH_TOKEN);
        userTokenRepository.save(refreshToken);
    }

    @Override
    public JwtResponse refreshAccessToken(RefreshTokenRequest refreshToken) throws InvalidTokenException {
        UserToken userToken = userTokenRepository.findByToken(refreshToken.getRefreshToken());

        if (userToken == null
                || userToken.getExpiryDate().isBefore(LocalDateTime.now())
                || userToken.getTokenType() != TokenType.REFRESH_TOKEN) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        User _user = userToken.getUser();
        userTokenRepository.delete(userToken);

        String newAccessToken = jwtProviderUtil.generaTokenUsingEmail(_user);
        saveRefreshToken(_user);
        return JwtResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }
}
