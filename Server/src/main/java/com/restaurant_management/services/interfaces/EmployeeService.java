package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.EmployeeDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.EmployeeResponse;
import com.restaurant_management.payloads.responses.GetEmailEmployeeResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.util.List;

public interface EmployeeService {

    ApiResponse addEmployee(EmployeeDto employeeDto) throws DataExitsException;

    List<GetEmailEmployeeResponse> getEmailsEmployee() throws DataExitsException;

    List<GetEmailEmployeeResponse> getEmailsUser() throws DataExitsException;

    EmployeeResponse getEmployeeById(String employeeId) throws DataExitsException;

    PagedModel<EntityModel<EmployeeResponse>> getAllEmployees(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse updateEmployee(EmployeeDto employeeDto) throws DataExitsException;

    ApiResponse deleteEmployee(String employeeId) throws DataExitsException;
}
