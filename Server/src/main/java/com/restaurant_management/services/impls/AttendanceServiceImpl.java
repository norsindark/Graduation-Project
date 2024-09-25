package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Attendance;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.StatusAttendanceRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.AttendanceByDateResponse;
import com.restaurant_management.repositories.AttendanceRepository;
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

@Service
@Component
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final PagedResourcesAssembler<AttendanceByDateResponse> pagedResourcesAssembler;

    @Override
    public PagedModel<EntityModel<AttendanceByDateResponse>> getAttendanceByDate(String date, int pageNo
            , int pageSize, String sortBy, String sortDir) throws DataExitsException {

        Timestamp attendanceDate = Timestamp.valueOf(LocalDate.parse(date).atStartOfDay());

        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Attendance> pagedResult = attendanceRepository.findByAttendanceDate(attendanceDate, paging);
        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult.map(AttendanceByDateResponse::new));
        } else {
            throw new DataExitsException("No attendance found");
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
}
