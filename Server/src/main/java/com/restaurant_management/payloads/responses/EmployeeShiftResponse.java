package com.restaurant_management.payloads.responses;


import com.restaurant_management.entites.Shift;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeShiftResponse {
    private String shiftId;
    private String shiftName;
    private String startTime;
    private String endTime;
    private List<EmployeeResponse> employees;

    public EmployeeShiftResponse(Shift shift, List<EmployeeResponse> employees) {
        this.shiftId = shift.getId();
        this.shiftName = shift.getShiftName();
        this.startTime = shift.getStartTime().toString();
        this.endTime = shift.getEndTime().toString();
        this.employees = employees;
    }
}
