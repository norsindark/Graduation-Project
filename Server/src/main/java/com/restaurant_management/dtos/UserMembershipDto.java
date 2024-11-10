package com.restaurant_management.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
public class UserMembershipDto {
    private String id;
    private String email;
    private Boolean enabled;
    private Timestamp createdAt;

    public UserMembershipDto(String id, String email, Boolean enabled, Timestamp createdAt) {
        this.id = id;
        this.email = email;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }
}
