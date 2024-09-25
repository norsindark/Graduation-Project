package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Attendance;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.entites.Shift;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.AddEmployeeToShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.AttendanceRepository;
import com.restaurant_management.repositories.EmployeeRepository;
import com.restaurant_management.repositories.EmployeeShiftRepository;
import com.restaurant_management.repositories.ShiftRepository;
import com.restaurant_management.services.interfaces.EmployeeShiftService;
import jakarta.transaction.Transactional;
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

import java.sql.Timestamp;
import java.time.LocalDate;
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

        for (String employeeId : request.getEmployeeIds()) {
            Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
            if (employeeOpt.isEmpty()) {
                throw new DataExitsException("Employee not found for ID: " + employeeId);
            }

            LocalDate startDate = request.getStartDate();
            LocalDate endDate = request.getEndDate();

            while (!startDate.isAfter(endDate)) {
                Timestamp workDate = Timestamp.valueOf(startDate.atStartOfDay());

                if (employeeShiftRepository.existsByEmployeeAndShiftAndWorkDate(
                        employeeOpt.get(), shiftOpt.get(), workDate)) {
                    throw new DataExitsException("Employee shift already exists for employee ID: " + employeeId +
                            " on date: " + startDate);
                }

                if (attendanceRepository.existsByEmployeeAndShiftAndAttendanceDate(
                        employeeOpt.get(), shiftOpt.get(), workDate)) {
                    throw new DataExitsException("Attendance already exists for employee ID: " + employeeId +
                            " on date: " + startDate);
                }

                EmployeeShift employeeShift = new EmployeeShift();
                employeeShift.setEmployee(employeeOpt.get());
                employeeShift.setShift(shiftOpt.get());
                employeeShift.setWorkDate(workDate);
                employeeShifts.add(employeeShift);

                Attendance attendance = new Attendance();
                attendance.setEmployee(employeeOpt.get());
                attendance.setShift(shiftOpt.get());
                attendance.setAttendanceDate(workDate);
                attendance.setStatus(StatusType.PENDING.toString());
                attendance.setNote(null);
                attendances.add(attendance);

                startDate = startDate.plusDays(1);
            }
        }

        employeeShiftRepository.saveAll(employeeShifts);
        attendanceRepository.saveAll(attendances);

        return new ApiResponse("Employees and attendances added successfully", HttpStatus.CREATED);
    }

    @Override
    @Modifying
    public ApiResponse removeEmployeeFromShift(String employeeId, String shiftId) throws DataExitsException {
        Optional<EmployeeShift> employeeShiftOpt = employeeShiftRepository.findByEmployeeIdAndShiftId(employeeId, shiftId);

        if (employeeShiftOpt.isEmpty()) {
            throw new DataExitsException("Employee shift does not exist");
        }

        LocalDate workDate = employeeShiftOpt.get().getWorkDate().toLocalDateTime().toLocalDate();
        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndShiftIdAndAttendanceDate(employeeId, shiftId, Timestamp.valueOf(workDate.atStartOfDay()));

        System.out.println("Here");

        if (!attendances.isEmpty()) {
            attendanceRepository.deleteAll(attendances);
        }

        System.out.println("Here 2");

        employeeShiftRepository.delete(employeeShiftOpt.get());

        System.out.println("Here 3");
        return new ApiResponse("Employee removed from shift and corresponding attendance deleted successfully", HttpStatus.OK);
    }


    @Override
    public ApiResponse updateEmployeeShift(AddEmployeeToShiftRequest request) throws DataExitsException {
        Optional<EmployeeShift> employeeShiftOpt = employeeShiftRepository.findByEmployeeIdAndShiftId(request.getEmployeeIds().get(0), request.getShiftId());

        if (employeeShiftOpt.isEmpty()) {
            throw new DataExitsException("Employee shift does not exist");
        }

        EmployeeShift employeeShift = employeeShiftOpt.get();
        employeeShift.setWorkDate(Timestamp.valueOf(request.getStartDate().atStartOfDay()));

        employeeShiftRepository.save(employeeShift);

        return new ApiResponse("Employee shift updated successfully", HttpStatus.OK);
    }
}
