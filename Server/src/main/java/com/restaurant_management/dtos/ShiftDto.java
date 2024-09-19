package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftDto {
    private String shiftName;
    private String startTime;
    private String endTime;
    private Set<String> employeeIds = new HashSet<>();

}

