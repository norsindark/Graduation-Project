package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShiftRequest {
    private String shiftId;
    private String shiftName;
    private String startTime;
    private String endTime;
    private List<String> employeeIds;
}
