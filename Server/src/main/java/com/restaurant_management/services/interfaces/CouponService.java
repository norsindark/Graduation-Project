package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.CouponDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CouponResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface CouponService {
    ApiResponse addNewCoupon(CouponDto request) throws DataExitsException;

    PagedModel<EntityModel<CouponResponse>> getAllCoupons(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse deleteCoupon(String id) throws DataExitsException;
}
