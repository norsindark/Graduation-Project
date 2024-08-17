package com.restaurant_management.payloads.requests;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignUpRequest {

    @Email
    @Column(unique = true)
    @NotBlank(message = "email can't be empty")
    private String email;

    @NotBlank(message = "Password can't be empty")
    @Size(min = 6, max = 64, message = "Password length must be between 6 and 64 characters")
    @Pattern(regexp = "^.{6,}$", message = "Password need more than 6 characters")
    private String password;

    private String role;

    @NotBlank(message = "name can't be empty")
    private String fullName;

    public void setFullName(String fullName) {
        this.fullName = fullName.trim();
    }
}
