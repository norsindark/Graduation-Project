package com.restaurant_management.payloads.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignInRequest {
    @NotBlank(message = "email can't be empty")
    private String email;

    @NotBlank(message = "Password can't be empty")
    private String password;
}
