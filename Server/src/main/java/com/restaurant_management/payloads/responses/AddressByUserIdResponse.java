package com.restaurant_management.payloads.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.restaurant_management.entites.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
public class AddressByUserIdResponse {

    private UserResponse user;

    private List<AddressResponse> addresses;

    public AddressByUserIdResponse( Address address) {
//        UserResponse userRes = new UserResponse();
//        userRes.setFullName(user.getFullName());
//        userRes.setEmail(user.getEmail());

        List<AddressResponse> addressResponses = new ArrayList<>();

        AddressResponse addressRes = new AddressResponse();
        addressRes.setStreet(address.getStreet());
        addressRes.setCity(address.getCity());
        addressRes.setCountry(address.getCountry());
        addressRes.setPostalCode(address.getPostalCode());
        addressRes.setState(address.getState());
        addressRes.setAddressType(address.getAddressType());
        addressRes.setEmail(address.getEmail());
        addressRes.setPhoneNumber(address.getPhoneNumber());
        addressRes.setCreatedAt(address.getCreatedAt());
        addressRes.setUpdatedAt(address.getUpdatedAt());

        addressResponses.add(addressRes);
        this.addresses = addressResponses;

    }
}
