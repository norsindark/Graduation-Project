package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUserResponse {
    private String id;
    private String email;
    private String fullName;
    private Role role;
    private String status;

    public GetUserResponse(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.getStatus();
    }

}