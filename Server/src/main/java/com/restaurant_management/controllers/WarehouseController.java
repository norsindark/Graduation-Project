package com.restaurant_management.controllers;

import com.restaurant_management.dtos.WarehouseDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.WarehouseRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetIngredientNameResponse;
import com.restaurant_management.payloads.responses.WarehouseResponse;
import com.restaurant_management.services.interfaces.WarehouseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Warehouse", description = "Warehouse API")
@RequestMapping("/api/v1/dashboard/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping("/get-all-ingredients-name")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GetIngredientNameResponse>> getAllIngredientName() throws DataExitsException {
        return ResponseEntity.ok(warehouseService.getAllIngredientName());
    }

    @GetMapping("/get-all-ingredients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<WarehouseResponse>>> getAllWarehouses(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) throws DataExitsException {
        return ResponseEntity.ok(warehouseService.getAllWarehouses(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/add-new-ingredient")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addNewWarehouse(@RequestBody WarehouseDto request) throws DataExitsException {
        return ResponseEntity.ok(warehouseService.addNewWarehouse(request));
    }

    @PostMapping("/import-ingredients-from-excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> importWarehousesFromExcel(@RequestParam("file") MultipartFile file) throws DataExitsException {
        return ResponseEntity.ok(warehouseService.importWarehousesFromExcel(file));
    }

    @PutMapping("/update-ingredient")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateWarehouse(@RequestBody WarehouseRequest request) throws DataExitsException {
        return ResponseEntity.ok(warehouseService.updateWarehouse(request));
    }

    @DeleteMapping("/delete-ingredient/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteWarehouse(@PathVariable String id) throws DataExitsException {
        return ResponseEntity.ok(warehouseService.deleteWarehouse(id));
    }

    @GetMapping("/nearly-expired")
    public ResponseEntity<PagedModel<EntityModel<WarehouseResponse>>> getNearlyExpiredIngredients(
            @RequestParam(defaultValue = "7") int daysUntilExpiry,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "expiredDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir)
            throws DataExitsException {

        PagedModel<EntityModel<WarehouseResponse>> response = warehouseService.getNearlyExpiredIngredients(
                daysUntilExpiry, pageNo, pageSize, sortBy, sortDir);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<WarehouseResponse>> getLowStockIngredients(
            @RequestParam double threshold) throws DataExitsException {

        List<WarehouseResponse> response = warehouseService.getLowStockIngredients(threshold);

        return ResponseEntity.ok(response);
    }
}
