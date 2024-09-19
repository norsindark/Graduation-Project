package com.restaurant_management.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDto {
    private String employeeId;
    private String shiftId;
    private String date;
    private String status;
    private String note;
}
