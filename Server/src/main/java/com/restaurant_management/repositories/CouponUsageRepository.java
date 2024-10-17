package com.restaurant_management.repositories;

import com.restaurant_management.entites.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, String> {

    @Query("SELECT CASE WHEN COUNT(cu) > 0 THEN TRUE ELSE FALSE END FROM CouponUsage cu WHERE cu.couponId = :couponId AND cu.userId = :userId")
    boolean existsByCouponIdAndUserId(@Param("couponId") String couponId, @Param("userId") String userId);
}
