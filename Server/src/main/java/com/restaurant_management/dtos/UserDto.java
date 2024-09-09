package com.restaurant_management.dtos;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    @NotBlank(message = "name can't be empty")
    private String fullName;

    @Email
    @Column(unique = true)
    @NotBlank(message = "email can't be empty")
    private String email;


//    @NotBlank(message = "Password can't be empty")
//    @Size(min = 6, max = 64, message = "Password length must be between 6 and 64 characters")
//    @Pattern(regexp = "^.{6,}$", message = "Password need more than 6 characters")
//    private String password;
}
