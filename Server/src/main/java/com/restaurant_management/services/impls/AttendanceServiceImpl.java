package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Attendance;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.StatusAttendanceRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.AttendanceByDateResponse;
import com.restaurant_management.repositories.AttendanceRepository;
import com.restaurant_management.repositories.EmployeeRepository;
import com.restaurant_management.services.interfaces.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Service
@Component
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final PagedResourcesAssembler<AttendanceByDateResponse> pagedResourcesAssembler;
    private final EmployeeRepository employeeRepository;

    @Override
    public PagedModel<EntityModel<AttendanceByDateResponse>> getAttendanceByDate(
            String date, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {

        Timestamp attendanceDate = Timestamp.valueOf(LocalDate.parse(date).atStartOfDay());

        Pageable paging = switch (sortBy) {
            case "shiftName" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "s.shiftName"));
            case "shiftStartTime" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "s.startTime"));
            case "shiftEndTime" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "s.endTime"));
            case "attendanceId" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "a.id"));
            case "employeeName" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "e.employeeName"));
            case "attendanceDate" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "a.attendanceDate"));
            case "status" ->
                    PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), "a.status"));
            default -> throw new DataExitsException("Invalid sort field: " + sortBy);
        };

        Page<Attendance> pagedResult = attendanceRepository.findByAttendanceDate(attendanceDate, paging);
        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult.map(AttendanceByDateResponse::new));
        } else {
            throw new DataExitsException("No attendance found for this date: " + date);
        }
    }

    @Override
    public ApiResponse updateStatusOfAttendance(StatusAttendanceRequest request) throws DataExitsException {
        Attendance attendance = attendanceRepository.findById(request.getId())
                .orElseThrow(() -> new DataExitsException("Attendance not found"));

        StatusType status = StatusType.valueOf(request.getStatus());

        attendance.setStatus(status.toString());
        attendance.setNote(request.getNote());
        attendanceRepository.save(attendance);
        return new ApiResponse("Status of attendance updated successfully", HttpStatus.OK);
    }

    @Override
    public Long sumStatusPerMonth(Integer month, Integer year, String status) throws DataExitsException {
        try {
            StatusType statusType = StatusType.valueOf(status.toUpperCase());
            Long count = attendanceRepository.countStatusPerMonth(month, year, statusType.toString());
            return count != null ? count : 0;
        } catch (Exception e) {
            throw new DataExitsException("No attendance found for this month" + month + " and year " + year + " with status " + status);
        }
    }

    @Override
    public double sumSalaryPerMonth(Integer month, Integer year) throws DataExitsException {
        try {
            List<Object[]> attendanceCounts = attendanceRepository.countAttendanceByMonthAndYear(month, year);
            double totalSalary = 0;

            for (Object[] attendance : attendanceCounts) {
                String employeeId = (String) attendance[0];
                Long presentCount = (Long) attendance[1];
                Long absentCount = (Long) attendance[2];

                double actualSalary = calculateActualSalary(employeeId, presentCount, absentCount);
                totalSalary += actualSalary;

            }

            return totalSalary;
        } catch (Exception e) {
            throw new DataExitsException("No attendance found for this month " + month + " and year " + year);
        }
    }

    @Override
    public double sumSalaryOfEmployeePerMonth(Integer month, Integer year, String employeeId) throws DataExitsException {
        try {
            List<Object[]> attendanceCounts = attendanceRepository.countAttendanceByEmployee(month, year, employeeId);
            double totalSalary = 0;

            for (Object[] attendance : attendanceCounts) {
                Long presentCount = (Long) attendance[1];
                Long absentCount = (Long) attendance[2];

                double actualSalary = calculateActualSalary(employeeId, presentCount, absentCount);
                totalSalary += actualSalary;

            }

            return totalSalary;
        } catch (Exception e) {
            throw new DataExitsException("No attendance found for this month " + month + " and year " + year);
        }
    }

    private double calculateActualSalary(String employeeId, Long presentCount, Long absentCount) throws DataExitsException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new DataExitsException("Employee not found"));

        double basicSalary = employee.getSalary();
        double actualSalary = 0;

        int minimumRequiredShifts = 30;

        if (presentCount >= minimumRequiredShifts) {
            actualSalary += basicSalary + ((presentCount - minimumRequiredShifts) * 250000);
        }
        if (absentCount > 0) {
            actualSalary -= absentCount * 250000;
        }
        return actualSalary;
    }
}
