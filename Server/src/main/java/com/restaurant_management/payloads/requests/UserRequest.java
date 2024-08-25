package com.restaurant_management.payloads.requests;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserRequest {

    private String id;

    @Email
    @Column(unique = true)
    @NotBlank(message = "email can't be empty")
    private String email;

    @NotBlank(message = "role can't be empty")
    private String role;

    @NotBlank(message = "status can't be empty")
    private String status;

    @NotBlank(message = "name can't be empty")
    private String fullName;

    public void setFullName(String fullName) {
        this.fullName = fullName.trim();
    }
}
