package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String email;
    private String fullName;
    private String avatar;

    private Set<Address> addresses = new HashSet<>();
}
