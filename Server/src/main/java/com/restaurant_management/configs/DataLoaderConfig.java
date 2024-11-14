package com.restaurant_management.configs;

import com.restaurant_management.entites.Role;
import com.restaurant_management.entites.User;
import com.restaurant_management.enums.RoleName;
import com.restaurant_management.repositories.RoleRepository;
import com.restaurant_management.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Configuration
public class DataLoaderConfig {

    @Value("${restaurant_management.admin.email}")
    private String adminEmail;

    @Value("${restaurant_management.admin.password}")
    private String adminPassword;

    @Value("${restaurant_management.admin.fullName}")
    private String adminFullName;


    @Bean
    public CommandLineRunner loadRolesAndAdmin(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            for (RoleName roleName : RoleName.values()) {
                if (roleRepository.findByName(roleName.name()) == null) {
                    Role role = Role.builder()
                            .name(roleName.name())
                            .build();
                    roleRepository.save(role);
                    System.out.println("Role " + roleName.name() + " created.");
                }
            }

            Optional<User> existingAdmin = userRepository.findByEmail("norsindark@gmail.com");
            if (existingAdmin.isEmpty()) {
                Role adminRole = roleRepository.findByName(RoleName.ADMIN.name());
                if (adminRole != null) {
                    String encodedPassword = passwordEncoder.encode(adminPassword);
                    User admin = User.builder()
                            .fullName(adminFullName)
                            .email(adminEmail)
                            .password(encodedPassword)
                            .role(adminRole)
                            .enabled(true)
                            .build();
                    userRepository.save(admin);
                    System.out.println("Admin user created.");
                }
            }
        };
    }
}
