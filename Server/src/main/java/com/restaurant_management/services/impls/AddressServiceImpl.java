package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.AddressDto;
import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.AddressByUserIdResponse;
import com.restaurant_management.payloads.responses.AddressResponse;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.AddressRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.AddressService;
import com.restaurant_management.utils.ApiUtil;
import com.restaurant_management.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Component
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    private final UserRepository userRepository;

    @Override
    public ApiResponse addAddress(AddressDto addressDto) throws DataExitsException {
        String currentUserName = SecurityUtils.getCurrentUserId();
        Optional<User> user = this.userRepository.findById(addressDto.getUserId());
        if (user.isEmpty()) {
            throw new DataExitsException("User not found");
        }


        if(currentUserName != null && !currentUserName.equals(user.get().getEmail())){
            return new ApiResponse("An error!", ApiUtil.createErrorDetails("You are not allowed to add address for this user"), HttpStatus.FORBIDDEN);
        }

        Address newAddress = addressDto.toAddress(user.get());

        User _user = user.get();
        _user.getAddresses().add(newAddress);

        newAddress.setUser(_user);

        this.addressRepository.save(newAddress);

        return new ApiResponse("Address added successfully", null, HttpStatus.OK);
    }

    @Override
    public ApiResponse updateAddress(AddressDto addressDto) throws DataExitsException {
        Optional<User> user = this.userRepository.findById(addressDto.getUserId());
        if (user.isEmpty()) {
            throw new DataExitsException("User not found");
        }
        Optional<Address> address = this.addressRepository.findById(addressDto.getId());
        if (address.isEmpty()) {
            throw new DataExitsException("Address not found");
        }
        Address _address = address.get();
        _address.setCity(addressDto.getCity());
        _address.setCountry(addressDto.getCountry());
        _address.setPostalCode(addressDto.getPostalCode());
        _address.setStreet(addressDto.getStreet());
        _address.setAddressType(addressDto.getAddressType());
        _address.setState(addressDto.getState());
        _address.setPhoneNumber(addressDto.getPhoneNumber());
        _address.setEmail(addressDto.getEmail());

        this.addressRepository.save(_address);

        return new ApiResponse("Address updated successfully", null, HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteAddress(String addressId) {
        Optional<Address> address = this.addressRepository.findById(addressId);
        if (address.isEmpty()) {
            return new ApiResponse("An error!", ApiUtil.createErrorDetails("Address not found"), HttpStatus.NOT_FOUND);
        }
        this.addressRepository.deleteById(addressId);
        return new ApiResponse("Address deleted successfully", HttpStatus.OK);
    }

    @Override
    public AddressResponse getAddress(String addressId) throws DataExitsException {
        Optional<Address> address = this.addressRepository.findById(addressId);
        if (address.isEmpty()) {
            throw new DataExitsException("Address not found");
        }
        new AddressResponse();
        return AddressResponse.toAddress(address.get());
    }

    @Override
    public Page<AddressByUserIdResponse> getAllAddressByUserId(String userId, int pageNo, int pageSize)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new DataExitsException("User not found");
        }

        Page<Address> addressPages = addressRepository.findByUserId(userId, pageable);

        return addressPages.map(AddressByUserIdResponse::new);
    }
}
