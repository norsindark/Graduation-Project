package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.AddressDto;
import com.restaurant_management.exceptions.AddressException;
import com.restaurant_management.exceptions.UserNotFoundException;
import com.restaurant_management.payloads.responses.AddressByUserIdResponse;
import com.restaurant_management.payloads.responses.AddressResponse;
import com.restaurant_management.payloads.responses.ApiResponse;
import org.springframework.data.domain.Page;

public interface AddressService {

    ApiResponse addAddress(AddressDto addressDto) throws AddressException, UserNotFoundException;

    ApiResponse updateAddress(AddressDto addressDto) throws AddressException;

    ApiResponse deleteAddress(String addressId) throws AddressException;

    AddressResponse getAddress(String addressId) throws AddressException;

    Page<AddressByUserIdResponse> getAllAddressByUserId(String userId, int pageNo, int pageSize)
            throws UserNotFoundException;
}
