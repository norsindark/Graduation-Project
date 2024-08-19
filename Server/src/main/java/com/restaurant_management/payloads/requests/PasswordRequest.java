package com.restaurant_management.payloads.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordRequest {

    private String userId;

    @NotBlank(message = "Old password can't be empty")
    private String oldPassword;

    //    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$", message = "Password must contain at least 8 characters, one uppercase, one lowercase and one number")
    @NotBlank(message = "Password can't be empty")
    @Size(min = 6, max = 255, message = "Password length must be between 6 and 255 characters")
    @Pattern(regexp = "^.{6,}$", message = "Password need more than 6 characters")
    private String newPassword;


}
