package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String fullName;
    private String avatar;
    private Role role;
    private Set<Address> addresses = new HashSet<>();
}
