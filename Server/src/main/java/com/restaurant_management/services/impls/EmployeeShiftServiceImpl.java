package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Attendance;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.entites.Shift;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.AddEmployeeToShiftRequest;
import com.restaurant_management.payloads.requests.UpdateEmployeeShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.AttendanceRepository;
import com.restaurant_management.repositories.EmployeeRepository;
import com.restaurant_management.repositories.EmployeeShiftRepository;
import com.restaurant_management.repositories.ShiftRepository;
import com.restaurant_management.services.interfaces.EmployeeShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class EmployeeShiftServiceImpl implements EmployeeShiftService {

    private final EmployeeRepository employeeRepository;
    private final ShiftRepository shiftRepository;
    private final EmployeeShiftRepository employeeShiftRepository;
    private final AttendanceRepository attendanceRepository;
    private final PagedResourcesAssembler<EmployeeShift> pagedResourcesAssembler;


//    @Override
//    public PagedModel<EntityModel<EmployeeShiftResponse>> getShiftsOfEmployee(String employeeId, int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
//        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
//        if (employeeOpt.isEmpty()) {
//            throw new DataExitsException("Employee not found");
//        }
//
//        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
//
//        Page<EmployeeShift> employeeShifts = employeeShiftRepository.findByEmployeeId(employeeId, paging);
//
//        List<EmployeeShiftResponse> employeeShiftResponses = new ArrayList<>();
//        for (EmployeeShift employeeShift : employeeShifts) {
//            Shift shift = employeeShift.getShift();
//            List<EmployeeResponse> employees = new ArrayList<>();
//            for (EmployeeShift employeeShift1 : shift.getEmployeeShifts()) {
//                employees.add(new EmployeeResponse(employeeShift1.getEmployee()));
//            }
//            employeeShiftResponses.add(new EmployeeShiftResponse(shift, employees));
//        }
//
//        return pagedResourcesAssembler.toModel(employeeShifts, EmployeeShiftResponse::new);
//    }

    @Override
    public PagedModel<EntityModel<EmployeeShift>> getAllEmployeeShifts(int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<EmployeeShift> pagedResult = employeeShiftRepository.findAll(paging);
        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult);
        } else {
            throw new DataExitsException("No Employee Shift found");
        }
    }

//    @Override
//    @Transactional
//    public ApiResponse addEmployeeToShift(AddEmployeeToShiftRequest request) throws DataExitsException {
//        if (request.getStartDate().isAfter(request.getEndDate())) {
//            throw new DataExitsException("Start date cannot be after end date");
//        }
//
//        Optional<Shift> shiftOpt = shiftRepository.findById(request.getShiftId());
//        if (shiftOpt.isEmpty()) {
//            throw new DataExitsException("Shift not found");
//        }
//
//        List<EmployeeShift> employeeShifts = new ArrayList<>();
//        List<Attendance> attendances = new ArrayList<>();
//
//        for (String employeeId : request.getEmployeeIds()) {
//            Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
//            if (employeeOpt.isEmpty()) {
//                throw new DataExitsException("Employee not found for ID: " + employeeId);
//            }
//
//            LocalDate startDate = request.getStartDate();
//            LocalDate endDate = request.getEndDate();
//
//            while (!startDate.isAfter(endDate)) {
//                Timestamp workDate = Timestamp.valueOf(startDate.atStartOfDay());
//
//                if (employeeShiftRepository.existsByEmployeeAndShiftAndWorkDate(
//                        employeeOpt.get(), shiftOpt.get(), workDate)) {
//                    throw new DataExitsException("Employee shift already exists for employee ID: " + employeeId +
//                            " on date: " + startDate);
//                }
//
//                if (attendanceRepository.existsByEmployeeAndShiftAndAttendanceDate(
//                        employeeOpt.get(), shiftOpt.get(), workDate)) {
//                    throw new DataExitsException("Attendance already exists for employee ID: " + employeeId +
//                            " on date: " + startDate);
//                }
//
//                EmployeeShift employeeShift = new EmployeeShift();
//                employeeShift.setEmployee(employeeOpt.get());
//                employeeShift.setShift(shiftOpt.get());
//                employeeShift.setWorkDate(workDate);
//                employeeShifts.add(employeeShift);
//
//                Attendance attendance = new Attendance();
//                attendance.setEmployee(employeeOpt.get());
//                attendance.setShift(shiftOpt.get());
//                attendance.setAttendanceDate(workDate);
//                attendance.setStatus(StatusType.PENDING.toString());
//                attendance.setNote(null);
//                attendances.add(attendance);
//
//                startDate = startDate.plusDays(1);
//            }
//        }
//
//        employeeShiftRepository.saveAll(employeeShifts);
//        attendanceRepository.saveAll(attendances);
//
//        return new ApiResponse("Employees and attendances added successfully", HttpStatus.CREATED);
//    }

    @Override
    @Transactional
    public ApiResponse addEmployeeToShift(AddEmployeeToShiftRequest request) throws DataExitsException {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new DataExitsException("Start date cannot be after end date");
        }

        Optional<Shift> shiftOpt = shiftRepository.findById(request.getShiftId());
        if (shiftOpt.isEmpty()) {
            throw new DataExitsException("Shift not found");
        }

        List<EmployeeShift> employeeShifts = new ArrayList<>();
        List<Attendance> attendances = new ArrayList<>();
        List<String> messages = new ArrayList<>();

        for (String employeeId : request.getEmployeeIds()) {
            Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
            if (employeeOpt.isEmpty()) {
                messages.add("Employee not found for ID: " + employeeId);
                continue;
            }

            LocalDate startDate = request.getStartDate();
            LocalDate endDate = request.getEndDate();

            while (!startDate.isAfter(endDate)) {
                Timestamp workDate = Timestamp.valueOf(startDate.atStartOfDay());

                if (employeeShiftRepository.existsByEmployeeAndShiftAndWorkDate(
                        employeeOpt.get(), shiftOpt.get(), workDate)) {
                    messages.add("Employee shift already exists for " + employeeOpt.get().getEmployeeName() +
                            " on date: " + startDate + " for shift: " + shiftOpt.get().getShiftName());
                } else {
                    EmployeeShift employeeShift = new EmployeeShift();
                    employeeShift.setEmployee(employeeOpt.get());
                    employeeShift.setShift(shiftOpt.get());
                    employeeShift.setWorkDate(workDate);
                    employeeShifts.add(employeeShift);
                }

                if (attendanceRepository.existsByEmployeeAndShiftAndAttendanceDate(
                        employeeOpt.get(), shiftOpt.get(), workDate)) {
                    messages.add("Attendance already exists for " + employeeOpt.get().getEmployeeName() +
                            " on date: " + startDate + " for shift ID: " + shiftOpt.get().getShiftName());
                } else {
                    Attendance attendance = new Attendance();
                    attendance.setEmployee(employeeOpt.get());
                    attendance.setShift(shiftOpt.get());
                    attendance.setAttendanceDate(workDate);
                    attendance.setStatus(StatusType.PENDING.toString());
                    attendance.setNote(null);
                    attendances.add(attendance);
                }

                startDate = startDate.plusDays(1);
            }
        }

        if (!employeeShifts.isEmpty()) {
            employeeShiftRepository.saveAll(employeeShifts);
        }

        if (!attendances.isEmpty()) {
            attendanceRepository.saveAll(attendances);
        }

        String resultMessage = "Employees and attendances added successfully";
        if (!messages.isEmpty()) {
            resultMessage += ". However, there were some issues:" + "\n" + String.join("\n", messages);
        }

        return new ApiResponse(resultMessage, HttpStatus.CREATED);
    }

    @Override
    @Modifying
    @Transactional
    public ApiResponse removeEmployeeFromShift(String employeeId, String shiftId, String workDate)
            throws DataExitsException {

        Timestamp employeeShiftWorkDate = Timestamp.valueOf(LocalDate.parse(workDate).atStartOfDay());
        Timestamp todayStartOfDay = Timestamp.valueOf(LocalDate.now().atStartOfDay());

        if (employeeShiftWorkDate.before(todayStartOfDay)) {
            throw new DataExitsException("Cannot remove employee from past shifts");
        }
        Optional<EmployeeShift> employeeShiftOpt = employeeShiftRepository.findByEmployeeIdAndShiftIdAndWorkDate(
                employeeId, shiftId, employeeShiftWorkDate);
        if (employeeShiftOpt.isEmpty()) {
            throw new DataExitsException("Employee shift does not exist");
        }

        Timestamp workDateTimestamp = Timestamp.valueOf(LocalDate.parse(workDate).atStartOfDay());
        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndShiftIdAndAttendanceDate(
                employeeId, shiftId, workDateTimestamp);
        if (employeeShiftWorkDate.equals(todayStartOfDay)) {
            boolean hasAttendanceStatus = attendances.stream().anyMatch(attendance ->
                    attendance.getStatus().equals(StatusType.ABSENT.toString()) ||
                            attendance.getStatus().equals(StatusType.LATE.toString()) ||
                            attendance.getStatus().equals(StatusType.PRESENT.toString())
            );

            if (hasAttendanceStatus) {
                throw new DataExitsException("Cannot remove employee from today's shift after attendance has been recorded.");
            }
        }

        if (!attendances.isEmpty()) {
            attendanceRepository.deleteAll(attendances);
        }
        employeeShiftRepository.delete(employeeShiftOpt.get());
        return new ApiResponse("Employee removed from shift and corresponding attendance deleted successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse updateEmployeeShift(UpdateEmployeeShiftRequest request) throws DataExitsException {

        Timestamp workDateTimestamp = Timestamp.valueOf(LocalDate.parse(request.getWorkDate()).atStartOfDay());
        Timestamp newWorkDateTimestamp = Timestamp.valueOf(LocalDate.parse(request.getNewWorkDate()).atStartOfDay());

        EmployeeShift employeeShift = employeeShiftRepository.findByEmployeeIdAndShiftIdAndWorkDate(
                        request.getEmployeeIds(), request.getShiftId(), workDateTimestamp)
                .orElseThrow(() -> new DataExitsException("Employee shift does not exist"));

        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndShiftIdAndAttendanceDate(
                request.getEmployeeIds(), request.getShiftId(), workDateTimestamp);

        boolean hasAttendanceStatus = attendances.stream().anyMatch(attendance ->
                attendance.getStatus().equals(StatusType.ABSENT.toString()) ||
                        attendance.getStatus().equals(StatusType.LATE.toString()) ||
                        attendance.getStatus().equals(StatusType.PRESENT.toString())
        );

        if (hasAttendanceStatus) {
            throw new DataExitsException("Cannot update shift after attendance has been recorded.");
        }

        if (employeeShiftRepository.existsByEmployeeAndShiftAndWorkDate(
                employeeShift.getEmployee(), employeeShift.getShift(), newWorkDateTimestamp)) {
            throw new DataExitsException("Employee shift already exists for employee ID: " + request.getEmployeeIds() +
                    " on date: " + request.getNewWorkDate());
        }

        attendances.forEach(attendance -> {
            attendance.setAttendanceDate(newWorkDateTimestamp);
            attendanceRepository.save(attendance);
        });

        employeeShift.setWorkDate(newWorkDateTimestamp);
        employeeShiftRepository.save(employeeShift);

        return new ApiResponse("Employee shift updated successfully", HttpStatus.OK);
    }


    @Override
    public Long countEmployeeShifts(Integer month, Integer year) throws DataExitsException {
        try {
            return employeeShiftRepository.countEmployeeShiftsByMonthAndYear(month, year);
        } catch (Exception e) {
            throw new DataExitsException("Error counting employee shifts for month: " + month + " and year: " + year);
        }
    }

    @Override
    public Long sumHoursWorked(Integer month, Integer year) throws DataExitsException {
        try {
            List<Object[]> totalShiftInMonth = employeeShiftRepository.findShiftsByMonthAndYear(month, year);
            long totalHours = 0;

            for (Object[] shift : totalShiftInMonth) {

                LocalTime startTime = (LocalTime) shift[0];
                LocalTime endTime = (LocalTime) shift[1];

                long hoursWorked = Duration.between(startTime, endTime).toHours();

                totalHours += hoursWorked;
            }
            return totalHours;
        } catch (Exception e) {
            throw new DataExitsException("Error counting hours worked for month: " + month + " and year: " + year);
        }
    }

}