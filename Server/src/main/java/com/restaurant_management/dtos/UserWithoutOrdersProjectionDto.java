package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserWithoutOrdersProjectionDto {
    private String id;
    private String email;
    private boolean enabled;


    public UserWithoutOrdersProjectionDto(String id, String email, boolean enabled) {
        this.id = id;
        this.email = email;
        this.enabled = enabled;
    }
}
