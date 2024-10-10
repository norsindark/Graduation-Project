package com.restaurant_management.repositories;

import com.restaurant_management.entites.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, String> {
}
