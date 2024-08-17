package com.restaurant_management.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthenticationProvider authProvider;

    private final JwtAuthTokenFilterConfig jwtAuthFilter;

    public static final String[] UN_SECRET_URLS = {
            "/api/v1/auth/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-ui/**"
    };
    public static final String[] ADMIN_SECRET_URLS = {
            "/api/v1/admin/dashboard/**"
    };

    public static final String[] USER_SECRET_URLS = {
            "/api/v1/client/**",
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((request) -> request
                        .requestMatchers(UN_SECRET_URLS)
                        .permitAll()
                        .requestMatchers(ADMIN_SECRET_URLS)
                        .hasAuthority("ADMIN")
                        .requestMatchers(USER_SECRET_URLS)
                        .hasAnyAuthority("USER", "ADMIN")
                        .anyRequest()
                        .authenticated())
                .sessionManagement((request) -> request
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
