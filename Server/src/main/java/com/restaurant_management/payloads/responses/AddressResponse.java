package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
@Data
@AllArgsConstructor
@Builder
public class AddressResponse {

    private String id;

    private String street;

    private String city;

    private String country;

    private int postalCode;

    private String state;

    private String addressType;

    private String phoneNumber;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    public static AddressResponse toAddress(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .state(address.getState())
                .addressType(address.getAddressType())
                .phoneNumber(address.getPhoneNumber())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }

    public static List<AddressResponse> toAddressResponseList(List<Address> addresses) {
        return addresses.stream()
                .map(AddressResponse::toAddress)
                .collect(Collectors.toList());
    }

}
