package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.StatusAttendanceRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.AttendanceByDateResponse;
import com.restaurant_management.services.interfaces.AttendanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance API")
@RequestMapping("/api/v1/dashboard/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping("/get-attendance-by-date")
    public ResponseEntity<PagedModel<EntityModel<AttendanceByDateResponse>>>
    getAttendanceByDate(@RequestParam(required = false) String date,
                        @RequestParam(defaultValue = "0") int pageNo,
                        @RequestParam(defaultValue = "10") int pageSize,
                        @RequestParam(defaultValue = "shiftName") String sortBy,
                        @RequestParam(defaultValue = "asc") String sortDir) throws DataExitsException {
        if (date == null || date.isEmpty()) {
            date = LocalDate.now().toString();
        }
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date, pageNo, pageSize, sortBy, sortDir));
    }


    @PutMapping("/update-status")
    public ResponseEntity<ApiResponse> updateStatusOfAttendance(@RequestBody StatusAttendanceRequest request)
            throws DataExitsException {
        return ResponseEntity.ok(attendanceService.updateStatusOfAttendance(request));
    }
}