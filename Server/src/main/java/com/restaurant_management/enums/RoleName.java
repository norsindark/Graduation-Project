package com.restaurant_management.enums;

import lombok.Getter;

@Getter
public enum RoleName {
    ADMIN(1),
    EMPLOYEE(2),
    USER(3);

    private final int id;

    RoleName(int id) {
        this.id = id;
    }

}
