package com.restaurant_management.payloads.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetEmailEmployeeResponse {
    private String email;
    private String employeeName;
    private String id;
}
