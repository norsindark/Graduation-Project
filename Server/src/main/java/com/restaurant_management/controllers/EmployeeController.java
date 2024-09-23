package com.restaurant_management.controllers;

import com.restaurant_management.dtos.EmployeeDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.EmployeeResponse;
import com.restaurant_management.payloads.responses.GetEmailEmployeeResponse;
import com.restaurant_management.payloads.responses.GetEmailUserResponse;
import com.restaurant_management.services.interfaces.EmployeeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Employee")
@RequestMapping("/api/v1/dashboard/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/get-emails-employee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GetEmailEmployeeResponse>> getEmailsEmployee() throws DataExitsException {
        return ResponseEntity.ok(employeeService.getEmailsEmployee());
    }

    @GetMapping("/get-emails-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GetEmailUserResponse>> getEmailsUser() throws DataExitsException {
        return ResponseEntity.ok(employeeService.getEmailsUser());
    }

    @GetMapping("/get-all-employees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<EmployeeResponse>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "employeeName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) throws DataExitsException {
        return ResponseEntity.ok(employeeService.getAllEmployees(pageNo, pageSize, sortBy, sortDir));
    }


    @GetMapping("/get-employee-by-id/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable String employeeId) throws DataExitsException {
        return ResponseEntity.ok(employeeService.getEmployeeById(employeeId));
    }

    @PostMapping("/add-new-employee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addEmployee(@RequestBody EmployeeDto employeeDto) throws DataExitsException {
        return ResponseEntity.ok(employeeService.addEmployee(employeeDto));
    }

    @PutMapping("/update-employee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateEmployee(@RequestBody EmployeeDto employeeDto) throws DataExitsException {
        return ResponseEntity.ok(employeeService.updateEmployee(employeeDto));
    }

    @DeleteMapping("/delete-employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable String employeeId) throws DataExitsException {
        return ResponseEntity.ok(employeeService.deleteEmployee(employeeId));
    }
}
