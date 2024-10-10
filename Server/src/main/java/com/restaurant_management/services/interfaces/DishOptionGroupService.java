package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.DishOptionDto;
import com.restaurant_management.dtos.DishOptionGroupDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.DishOptionGroupRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.DishOptionGroupResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

import java.util.List;

public interface DishOptionGroupService {

    PagedModel<EntityModel<DishOptionGroupResponse>> getAllDishOptionGroups(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;

    ApiResponse addDishOptionGroup(DishOptionGroupDto request) throws DataExitsException;

    ApiResponse addDishOptions(String groupId, List<DishOptionDto> options) throws DataExitsException;

    ApiResponse updateDishOptionGroup(String groupId, DishOptionGroupRequest request) throws DataExitsException;

    ApiResponse deleteDishOptionGroup(String groupId) throws DataExitsException;

    ApiResponse updateDishOption(String optionId, DishOptionDto request) throws DataExitsException;

    ApiResponse deleteDishOption(String optionId) throws DataExitsException;
}
