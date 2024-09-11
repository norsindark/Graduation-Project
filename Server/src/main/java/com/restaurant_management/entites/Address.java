package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;

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

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "state")
    private String state;

    @Column(nullable = true)
    private String street;

    @Column(nullable = true)
    private String country;

    @Column(nullable = true)
    private String city;

    @Column(name = "postal_code")
    private int postalCode;

    @Column(name = "address_type")
    private String addressType;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @JsonBackReference
    private User user;
}
