package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @UuidGenerator
    @Column(name = "addresses_id", length = 36, nullable = false)
    private String id;

    @Column(nullable = true)
    private String street;

    @Column(nullable = true)
    private String country;

    @Column(nullable = true)
    private String city;

    @Column(name = "postal_code")
    private int postalCode;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @JsonBackReference
    private User user;
}
