package com.restaurant_management.repositories;

import com.restaurant_management.entites.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CouponRepository extends JpaRepository<Coupon, String> {
    @Query("SELECT c FROM Coupon c WHERE c.code = ?1")
    Coupon findByCode(String code);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END FROM Coupon c WHERE c.code = ?1")
    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, String id);
}
