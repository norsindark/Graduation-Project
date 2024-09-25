package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddEmployeeToShiftRequest {
    private List<String> employeeIds;
    private String shiftId;
    private LocalDate startDate;
    private LocalDate endDate;
}