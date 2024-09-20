package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.ShiftDto;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.entites.Shift;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.EmployeeResponse;
import com.restaurant_management.payloads.responses.EmployeeShiftResponse;
import com.restaurant_management.repositories.EmployeeRepository;
import com.restaurant_management.repositories.EmployeeShiftRepository;
import com.restaurant_management.repositories.ShiftRepository;
import com.restaurant_management.services.interfaces.ShiftService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Component
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeShiftRepository employeeShiftRepository;
    private final PagedResourcesAssembler<EmployeeShiftResponse> pagedResourcesAssembler;

    @Override
    public EmployeeShiftResponse getShiftsById(String id) throws DataExitsException {
        Optional<Shift> shiftOptional = shiftRepository.findById(id);
        if (shiftOptional.isEmpty()) {
            throw new DataExitsException("Shift not found");
        }
        Shift shift = shiftOptional.get();
        List<EmployeeShift> employeeShifts = employeeShiftRepository.findAllByShift(shift);
        List<EmployeeResponse> employeeResponses = employeeShifts.stream().map(EmployeeResponse::new).collect(Collectors.toList());
        return new EmployeeShiftResponse(shift, employeeResponses);
    }

    @Override
    public PagedModel<EntityModel<EmployeeShiftResponse>> getAllShifts(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Shift> pagedResult = shiftRepository.findAll(paging);

        if (pagedResult.hasContent()) {
            List<EmployeeShiftResponse> shiftResponses = new ArrayList<>();

            for (Shift shift : pagedResult) {
                List<EmployeeShift> employeeShifts = employeeShiftRepository.findAllByShift(shift);
                List<EmployeeResponse> employeeResponses = employeeShifts.stream()
                        .map(EmployeeResponse::new)
                        .collect(Collectors.toList());
                shiftResponses.add(new EmployeeShiftResponse(shift, employeeResponses));
            }

            return pagedResourcesAssembler.toModel(new PageImpl<>(shiftResponses, paging, pagedResult.getTotalElements()));
        } else {
            throw new DataExitsException("No Shift found");
        }
    }

    @Override
    @Transactional
    public ApiResponse addShift(ShiftDto shiftDto) throws DataExitsException {
        LocalTime startTime = LocalTime.parse(shiftDto.getStartTime());
        LocalTime endTime = LocalTime.parse(shiftDto.getEndTime());

        List<String> ids = new ArrayList<>(shiftDto.getEmployeeIds());
        List<Employee> employees = employeeRepository.findAllById(ids);

        if (employees.size() != shiftDto.getEmployeeIds().size()) {
            return new ApiResponse("One or more employee IDs are invalid", HttpStatus.NOT_FOUND);
        }

        Shift newShift = Shift.builder()
                .shiftName(shiftDto.getShiftName())
                .startTime(startTime)
                .endTime(endTime)
                .build();

        shiftRepository.save(newShift);

        for (Employee employee : employees) {
            EmployeeShift employeeShift = new EmployeeShift();
            employeeShift.setEmployee(employee);
            employeeShift.setShift(newShift);
            employeeShiftRepository.save(employeeShift);
        }

        return new ApiResponse("Shift added successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateShift(ShiftRequest shiftRequest) throws DataExitsException {
        Optional<Shift> shift = shiftRepository.findById(shiftRequest.getShiftId());

        if (shift.isEmpty()) {
            return new ApiResponse("Shift not found", HttpStatus.NOT_FOUND);
        }

        LocalTime startTime = LocalTime.parse(shiftRequest.getStartTime());
        LocalTime endTime = LocalTime.parse(shiftRequest.getEndTime());

        List<String> ids = new ArrayList<>(shiftRequest.getEmployeeIds());
        List<Employee> employees = employeeRepository.findAllById(ids);

        if (employees.size() != shiftRequest.getEmployeeIds().size()) {
            return new ApiResponse("One or more employee IDs are invalid", HttpStatus.NOT_FOUND);
        }

        Shift updatedShift = shift.get();
        updatedShift.setShiftName(shiftRequest.getShiftName());
        updatedShift.setStartTime(startTime);
        updatedShift.setEndTime(endTime);

        shiftRepository.save(updatedShift);

        List<EmployeeShift> employeeShifts = employeeShiftRepository.findAllByShift(updatedShift);
        employeeShiftRepository.deleteAll(employeeShifts);

        for (Employee employee : employees) {
            EmployeeShift employeeShift = new EmployeeShift();
            employeeShift.setEmployee(employee);
            employeeShift.setShift(updatedShift);
            employeeShiftRepository.save(employeeShift);
        }

        return new ApiResponse("Shift updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteShift(String id) throws DataExitsException {
        Optional<Shift> shift = shiftRepository.findById(id);
        if (shift.isEmpty()) {
            return new ApiResponse("Shift not found", HttpStatus.NOT_FOUND);
        }

        List<EmployeeShift> employeeShifts = employeeShiftRepository.findAllByShift(shift.get());
        employeeShiftRepository.deleteAll(employeeShifts);
        shiftRepository.deleteById(id);
        return new ApiResponse("Shift deleted successfully", HttpStatus.OK);
    }
}
