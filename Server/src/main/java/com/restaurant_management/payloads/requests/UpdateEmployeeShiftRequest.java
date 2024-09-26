package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateEmployeeShiftRequest {
    private String employeeIds;
    private String shiftId;
    private String workDate;
    private String newWorkDate;
}
