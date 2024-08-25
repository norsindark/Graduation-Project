package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.AddressDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.AddressByUserIdResponse;
import com.restaurant_management.payloads.responses.AddressResponse;
import com.restaurant_management.payloads.responses.ApiResponse;
import org.springframework.data.domain.Page;

public interface AddressService {

    ApiResponse addAddress(AddressDto addressDto) throws DataExitsException;

    ApiResponse updateAddress(AddressDto addressDto) throws DataExitsException;

    ApiResponse deleteAddress(String addressId) throws DataExitsException;

    AddressResponse getAddress(String addressId) throws DataExitsException;

    Page<AddressByUserIdResponse> getAllAddressByUserId(String userId, int pageNo, int pageSize)
            throws DataExitsException;
}
