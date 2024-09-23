package com.restaurant_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {

    private String employeeId;
    private String employeeName;
    List<String> emails;
    private double salary;
    private String jobTitle;
}
