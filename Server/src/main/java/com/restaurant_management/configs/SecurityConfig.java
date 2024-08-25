package com.restaurant_management.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {


    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

//    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
//    private String redirectUri;

    private final AuthenticationProvider authProvider;

    private final JwtAuthTokenFilterConfig jwtAuthFilter;

    public static final String[] UN_SECRET_URLS = {
            "/api/v1/auth/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "api/v1/oauth2/**",
            "/api/v1/category/**"
    };

    public static final String[] OAUTH2_SECRET_URLS = {
            "/api/v1/google/**"
    };


    public static final String[] ADMIN_SECRET_URLS = {
            "/api/v1/dashboard/**"
    };

    public static final String[] USER_SECRET_URLS = {
            "/api/v1/client/**",
    };


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(UN_SECRET_URLS).permitAll()
                        .requestMatchers(OAUTH2_SECRET_URLS).authenticated()
                        .requestMatchers(ADMIN_SECRET_URLS).hasAuthority("ADMIN")
                        .requestMatchers(USER_SECRET_URLS).hasAnyAuthority("USER", "ADMIN")
                        .anyRequest().authenticated())
                .oauth2Login(Customizer.withDefaults())
                .formLogin(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
