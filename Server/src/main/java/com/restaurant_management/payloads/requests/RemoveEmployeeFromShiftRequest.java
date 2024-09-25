package com.restaurant_management.payloads.requests;

import com.restaurant_management.entites.Shift;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RemoveEmployeeFromShiftRequest {
    private String employeeId;
    private String shiftId;
    private Shift newShift;
}
