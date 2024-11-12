package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingRequest {
    private String phoneNumber;
    private String email;
    private String facebook;
    private String instagram;
    private String twitter;
    private String openingTime;
    private String closingTime;
}
