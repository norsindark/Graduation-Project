package com.restaurant_management.dtos;

import com.restaurant_management.entites.Address;
import com.restaurant_management.entites.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {

    private String id;

    @NotBlank(message = "Street cant be empty")
    @Size(min = 3, max = 50, message = "Street must be between 3 and 50 characters")
    private String street;

    private String commune;

    private String district;

    @NotBlank(message = "Country cant be empty")
    @Size(min = 3, max = 50, message = "Country must be between 3 and 50 characters")
    private String country;

    @NotBlank(message = "City cant be empty")
    @Size(min = 3, max = 50, message = "City must be between 3 and 50 characters")
    private String city;

    private int postalCode;

    @Size(min = 3, max = 50, message = "Address type must be between 3 and 50 characters")
    private String addressType;

    @NotBlank(message = "State cant be empty")
    private String state;

    @Size(min = 9, max = 15, message = "Phone number must be between 9 and 15 digits")
    private String phoneNumber;

    private String userId;

    public Address toAddress(User user) {
        Address address = new Address();
        address.setUser(user);
        address.setStreet(this.street);
        address.setCommune(this.commune);
        address.setDistrict(this.district);
        address.setCity(this.city);
        address.setCountry(this.country);
        address.setPostalCode(this.postalCode);
        address.setAddressType(this.addressType);
        address.setState(this.state);
        address.setPhoneNumber(this.phoneNumber);
        return address;
    }

}
