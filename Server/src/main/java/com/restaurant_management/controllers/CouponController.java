package com.restaurant_management.controllers;

import com.restaurant_management.dtos.CouponDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CouponResponse;
import com.restaurant_management.services.interfaces.CouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Coupon", description = "Coupon API")
@RequestMapping("/api/v1/dashboard/coupon")
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/get-all-coupons")
    public ResponseEntity<PagedModel<EntityModel<CouponResponse>>> getAllCoupons(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "startDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(couponService.getAllCoupons(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-new-coupon")
    public ResponseEntity<ApiResponse> addNewCoupon(@RequestBody CouponDto request) throws DataExitsException {
        return ResponseEntity.ok(couponService.addNewCoupon(request));
    }

    @DeleteMapping("/delete-coupon/{id}")
    public ResponseEntity<ApiResponse> deleteCoupon(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(couponService.deleteCoupon(id));
    }
}
