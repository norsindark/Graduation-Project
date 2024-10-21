package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.CouponDto;
import com.restaurant_management.entites.Coupon;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CouponResponse;
import com.restaurant_management.repositories.CouponRepository;
import com.restaurant_management.services.interfaces.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;
    private final PagedResourcesAssembler<CouponResponse> pagedResourcesAssembler;

    @Override
    public CouponResponse getCouponByCode(String code) throws DataExitsException {
        Coupon coupon = couponRepository.findByCode(code);
        if (coupon == null) {
            throw new DataExitsException("Coupon not found");
        }
        return new CouponResponse(coupon);
    }

    @Override
    public PagedModel<EntityModel<CouponResponse>> getAllCoupons(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Coupon> pageResult = couponRepository.findAll(pageable);

        if (pageResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pageResult.map(CouponResponse::new));
        } else {
            throw new DataExitsException("No coupons found");
        }
    }

    @Override
    public ApiResponse addNewCoupon(CouponDto request) {
        if (couponRepository.existsByCode(request.getCode())) {
            return new ApiResponse("Coupon already exists", HttpStatus.BAD_REQUEST);
        }
        Coupon coupon = Coupon.builder()
                .code(request.getCode())
                .description(request.getDescription())
                .discountPercent(request.getDiscountPercent())
                .maxDiscount(request.getMaxDiscount())
                .minOrderValue(request.getMinOrderValue())
                .quantity(request.getMaxUsage())
                .startDate(request.getStartDate())
                .expirationDate(request.getExpirationDate())
                .build();
        couponRepository.save(coupon);
        return new ApiResponse("Coupon created successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse deleteCoupon(String id) throws DataExitsException {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new DataExitsException("Coupon not found"));
        couponRepository.delete(coupon);
        return new ApiResponse("Coupon deleted successfully", HttpStatus.OK);
    }
}
