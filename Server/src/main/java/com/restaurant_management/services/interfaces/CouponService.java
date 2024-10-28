package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.CouponDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.CouponRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CouponResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface CouponService {
    CouponResponse getCouponByCode(String code) throws DataExitsException;
    ApiResponse addNewCoupon(CouponDto request) throws DataExitsException;

    PagedModel<EntityModel<CouponResponse>> getAllCoupons(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse updateCoupon(String id, CouponRequest request) throws DataExitsException;

    ApiResponse deleteCoupon(String id) throws DataExitsException;

    ApiResponse checkCouponUsageByCodeAndUserId(String code, String userId) throws DataExitsException;
}
