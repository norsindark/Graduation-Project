package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.ShiftDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.ShiftRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.ShiftResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

public interface ShiftService {
    ShiftResponse getShiftsById(String id) throws DataExitsException;

    PagedModel<EntityModel<ShiftResponse>> getAllShifts(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse addShift(ShiftDto shiftDto) throws DataExitsException;

    ApiResponse updateShift(ShiftRequest ShiftRequest) throws DataExitsException;

    ApiResponse deleteShift(String id) throws DataExitsException;
}
