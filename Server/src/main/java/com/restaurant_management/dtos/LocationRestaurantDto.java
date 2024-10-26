package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationRestaurantDto {
    private String id;
    private String street;
    private String commune;
    private String district;
    private String city;
    private String state;
    private String country;
    private String latitude;
    private String longitude;
    private double feePerKm;
}
