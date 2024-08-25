package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String email;
    private String fullName;
    private String avatar;
    private Role role;
    private boolean enabled;

//    private Set<Address> addresses = new HashSet<>();

    public UserResponse(User user) {
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.avatar = user.getAvatar();
        this.role = user.getRole();
        this.enabled = user.isEnabled();

//        List<Address> addresses = user.getAddresses();
//        this.addresses = new HashSet<>(addresses);
    }

}
