package com.restaurant_management.controllers;

import com.restaurant_management.dtos.ShiftDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.EmployeeShiftResponse;
import com.restaurant_management.services.interfaces.ShiftService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Shift")
@RequestMapping("/api/v1/dashboard/shift")
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping("/get-shifts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeShiftResponse> getShiftsById(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(shiftService.getShiftsById(id));
    }

    @GetMapping("/get-all-shifts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<EmployeeShiftResponse>>> getAllShifts(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) throws DataExitsException {
        return ResponseEntity.ok(shiftService.getAllShifts(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-new-shift")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addShift(@RequestBody ShiftDto shiftDto) throws DataExitsException {
        return ResponseEntity.ok(shiftService.addShift(shiftDto));
    }

    @PutMapping("/update-shift")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateShift(@RequestBody ShiftRequest shiftRequest) throws DataExitsException {
        return ResponseEntity.ok(shiftService.updateShift(shiftRequest));
    }

    @DeleteMapping("/delete-shift/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteShift(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(shiftService.deleteShift(id));
    }
}
