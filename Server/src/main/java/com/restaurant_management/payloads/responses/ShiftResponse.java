package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Shift;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShiftResponse {
    private String id;
    private String shiftName;
    private String startTime;
    private String endTime;
    private List<EmployeeResponse> employees;

    public ShiftResponse(Shift shift) {
        this.id = shift.getId();
        this.shiftName = shift.getShiftName();
        this.startTime = shift.getStartTime().toString();
        this.endTime = shift.getEndTime().toString();
        this.employees = shift.getEmployeeShifts().stream()
                .map(employeeShift -> new EmployeeResponse(
                        employeeShift.getEmployee()
                ))
                .collect(Collectors.toList());
    }
}
