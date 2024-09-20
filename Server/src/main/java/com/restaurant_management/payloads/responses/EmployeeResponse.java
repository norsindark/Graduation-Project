package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.EmployeeShift;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DecimalFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeResponse {

    private String employeeId;
    private String employeeName;
    private String email;
    private String jobTitle;
    private String salary;

    public EmployeeResponse(Employee employee){
        this.employeeId = employee.getId();
        this.employeeName = employee.getEmployeeName();
        this.email = employee.getUser().getEmail();
        this.jobTitle = employee.getJobTitle();
        this.salary = decimalFormat.format(employee.getSalary());
    }

    public EmployeeResponse(EmployeeShift employeeShift) {
        this.employeeId = employeeShift.getEmployee().getId();
        this.employeeName = employeeShift.getEmployee().getEmployeeName();
        this.email = employeeShift.getEmployee().getUser().getEmail();
        this.jobTitle = employeeShift.getEmployee().getJobTitle();
        this.salary = decimalFormat.format(employeeShift.getEmployee().getSalary());
    }

    private static final DecimalFormat decimalFormat = new DecimalFormat("#,###.##");
}
