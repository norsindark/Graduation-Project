package com.restaurant_management.repositories;

import com.restaurant_management.entites.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
    Role findByName(String string);
}
