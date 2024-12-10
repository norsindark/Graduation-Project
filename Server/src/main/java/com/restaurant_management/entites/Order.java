package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {

    @Id
    @UuidGenerator
    @Column(name = "order_id", length = 36, nullable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderItem> items;

    @Column(name = "shipping_fee", nullable = false)
    private Double shippingFee;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "address_id", length = 36)
    private String addressId;

    @Column(name = "phoneNumber", length = 15)
    private String phoneNumber;

    @Column(name = "state")
    private String state;

    @Column(name = "street")
    private String street;

    @Column(name = "commune")
    private String commune;

    @Column(name = "district")
    private String district;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_code")
    private int postalCode;

    @Column(name = "address_type")
    private String addressType;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod;

    @Column(name = "note", length = 255)
    private String note;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
