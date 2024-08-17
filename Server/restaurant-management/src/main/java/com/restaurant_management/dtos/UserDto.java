package com.restaurant_management.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

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


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp created_at;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp updated_at;
}
