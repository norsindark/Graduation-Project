package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeResponse {

    private String employeeId;
    private String employeeName;
    private String email;
    private String jobTitle;
    private double salary;

    public EmployeeResponse(Employee employee){
        this.employeeId = employee.getId();
        this.employeeName = employee.getEmployeeName();
        this.email = employee.getUser().getEmail();
        this.jobTitle = employee.getJobTitle();
        this.salary = employee.getSalary();
    }
}
