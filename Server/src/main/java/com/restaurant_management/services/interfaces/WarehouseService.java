package com.restaurant_management.services.interfaces;

import com.restaurant_management.dtos.WarehouseDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.WarehouseRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetIngredientNameResponse;
import com.restaurant_management.payloads.responses.WarehouseResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface WarehouseService {
    List<GetIngredientNameResponse> getAllIngredientName() throws DataExitsException;

    ApiResponse importWarehousesFromExcel(MultipartFile file) throws DataExitsException;

    ApiResponse addNewWarehouse(WarehouseDto request) throws DataExitsException;

    ApiResponse updateWarehouse(WarehouseRequest request) throws DataExitsException;

    PagedModel<EntityModel<WarehouseResponse>> getAllWarehouses(int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException;

    ApiResponse deleteWarehouse(String id) throws DataExitsException;

    PagedModel<EntityModel<WarehouseResponse>> getNearlyExpiredIngredients(
            int daysUntilExpiry, int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException;
    List<WarehouseResponse> getLowStockIngredients(double threshold) throws DataExitsException;
}