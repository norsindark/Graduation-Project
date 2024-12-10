package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.ShiftDto;
import com.restaurant_management.entites.Shift;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.ShiftResponse;
import com.restaurant_management.repositories.EmployeeShiftRepository;
import com.restaurant_management.repositories.ShiftRepository;
import com.restaurant_management.services.interfaces.ShiftService;
import jakarta.transaction.Transactional;
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

import java.time.LocalTime;
import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;
    private final EmployeeShiftRepository employeeShiftRepository;
    private final PagedResourcesAssembler<ShiftResponse> pagedResourcesAssembler;

    @Override
    public ShiftResponse getShiftsById(String id) throws DataExitsException {
        Optional<Shift> shiftOptional = shiftRepository.findById(id);
        if (shiftOptional.isEmpty()) {
            throw new DataExitsException("Shift not found");
        }
        Shift shift = shiftOptional.get();
         return new ShiftResponse(shift);
    }

    @Override
    public PagedModel<EntityModel<ShiftResponse>> getAllShifts(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Shift> pagedResult = shiftRepository.findAll(paging);

        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult.map(ShiftResponse::new));
        } else {
            throw new DataExitsException("No Shift found");
        }
    }

    @Override
    @Transactional
    public ApiResponse addShift(ShiftDto shiftDto) throws DataExitsException {
        LocalTime startTime = LocalTime.parse(shiftDto.getStartTime());
        LocalTime endTime = LocalTime.parse(shiftDto.getEndTime());

        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }

        if (shiftRepository.existsByShiftName(shiftDto.getShiftName())) {
            throw new DataExitsException("Shift already exists");
        }

        Shift newShift = Shift.builder()
                .shiftName(shiftDto.getShiftName())
                .startTime(startTime)
                .endTime(endTime)
                .build();

        shiftRepository.save(newShift);

        return new ApiResponse("Shift added successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateShift(ShiftRequest shiftRequest) throws DataExitsException {
        Optional<Shift> shift = shiftRepository.findById(shiftRequest.getShiftId());

        if (shift.isEmpty()) {
            throw new DataExitsException("Shift not found");
        }

        Shift currentShift = shift.get();

        if (!currentShift.getShiftName().equals(shiftRequest.getShiftName()) &&
                shiftRepository.existsByShiftName(shiftRequest.getShiftName())) {
            throw new DataExitsException("Shift already exists");
        }

        LocalTime startTime = LocalTime.parse(shiftRequest.getStartTime());
        LocalTime endTime = LocalTime.parse(shiftRequest.getEndTime());

        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time cannot be after end time");
        }

        currentShift.setShiftName(shiftRequest.getShiftName());
        currentShift.setStartTime(startTime);
        currentShift.setEndTime(endTime);

        shiftRepository.save(currentShift);

        return new ApiResponse("Shift updated successfully", HttpStatus.OK);
    }

    @Override
    @Transactional
    public ApiResponse deleteShift(String id) throws DataExitsException {
        Optional<Shift> shift = shiftRepository.findById(id);
        if (shift.isEmpty()) {
            throw new DataExitsException("Shift not found");
        }

//        List<EmployeeShift> employeeShifts = employeeShiftRepository.findAllByShift(shift.get());
//        employeeShiftRepository.deleteAll(employeeShifts);
        shiftRepository.deleteById(id);
        return new ApiResponse("Shift deleted successfully", HttpStatus.OK);
    }
}
