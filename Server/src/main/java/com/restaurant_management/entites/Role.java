package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "roles")
public class Role {

    @Id
    @UuidGenerator
    @Column(name = "role_id", length = 36, nullable = false)
    private String id;

    @Column(nullable = false, unique = true, length = 10)
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonBackReference
    public Set<User> user = new HashSet<>();
}
