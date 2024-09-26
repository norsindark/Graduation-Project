package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.StatusAttendanceRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.AttendanceByDateResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface AttendanceService {
    PagedModel<EntityModel<AttendanceByDateResponse>> getAttendanceByDate(String date, int pageNo
            , int pageSize, String sortBy, String sortDir) throws DataExitsException;

    ApiResponse updateStatusOfAttendance(StatusAttendanceRequest request) throws DataExitsException;

    Long sumStatusPerMonth(Integer month, Integer year, String status) throws DataExitsException;

    double sumSalaryOfEmployeePerMonth(Integer month, Integer year, String employeeId) throws DataExitsException;

    double sumSalaryPerMonth(Integer month, Integer year) throws DataExitsException;
}
