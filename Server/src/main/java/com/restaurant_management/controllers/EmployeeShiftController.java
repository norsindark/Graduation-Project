package com.restaurant_management.controllers;

import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.AddEmployeeToShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.services.interfaces.EmployeeShiftService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Employee Shift", description = "Employee Shift API")
@RequestMapping("/api/v1/dashboard/shift")
public class EmployeeShiftController {

    private final EmployeeShiftService employeeShiftService;

    @GetMapping("/all-employee-shifts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<EmployeeShift>>> getAllEmployeeShifts(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) throws DataExitsException {
        return ResponseEntity.ok(employeeShiftService.getAllEmployeeShifts(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-employee-to-shift")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addEmployeeToShift(@RequestBody AddEmployeeToShiftRequest request) throws DataExitsException {
        return ResponseEntity.ok(employeeShiftService.addEmployeeToShift(request));
    }

//    @DeleteMapping("/remove-employee-from-shift/{employeeId}/{shiftId}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse> removeEmployeeFromShift(@PathVariable String employeeId, @PathVariable String shiftId) throws DataExitsException {
//        return ResponseEntity.ok(employeeShiftService.removeEmployeeFromShift(employeeId, shiftId));
//    }
//
//    @PutMapping("/update-employee-shift")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse> updateEmployeeShift(@RequestBody AddEmployeeToShiftRequest request) throws DataExitsException {
//        return ResponseEntity.ok(employeeShiftService.updateEmployeeShift(request));
//    }
}
