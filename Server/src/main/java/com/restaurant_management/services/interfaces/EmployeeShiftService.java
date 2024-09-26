package com.restaurant_management.services.interfaces;

import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.AddEmployeeToShiftRequest;
import com.restaurant_management.payloads.requests.UpdateEmployeeShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface EmployeeShiftService {

//    PagedModel<EntityModel<EmployeeShiftResponse>> getShiftsOfEmployee(String employeeId, int page, int size, String sortBy, String sortDir) throws DataExitsException;

    PagedModel<EntityModel<EmployeeShift>> getAllEmployeeShifts( int page, int size, String sortBy, String sortDir) throws DataExitsException;

    ApiResponse addEmployeeToShift(AddEmployeeToShiftRequest request) throws DataExitsException;

    ApiResponse removeEmployeeFromShift(String employeeId, String shiftId, String workDate) throws DataExitsException;

    ApiResponse updateEmployeeShift(UpdateEmployeeShiftRequest request) throws DataExitsException;

    Long countEmployeeShifts(Integer month, Integer year) throws DataExitsException;

    Long sumHoursWorked(Integer month, Integer year) throws DataExitsException;
}
