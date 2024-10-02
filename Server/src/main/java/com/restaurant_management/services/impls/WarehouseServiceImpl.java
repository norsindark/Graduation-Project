package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.WarehouseDto;
import com.restaurant_management.entites.Category;
import com.restaurant_management.entites.Warehouse;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.WarehouseRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.WarehouseResponse;
import com.restaurant_management.repositories.CategoryRepository;
import com.restaurant_management.repositories.WarehouseRepository;
import com.restaurant_management.services.interfaces.WarehouseService;
import com.restaurant_management.utils.ApiUtil;
import com.restaurant_management.utils.ExcelHelperUtil;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Component
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final CategoryRepository categoryRepository;
    private final PagedResourcesAssembler<WarehouseResponse> pagedResourcesAssembler;

    @Override
    public ApiResponse addNewWarehouse(WarehouseDto request) throws DataExitsException {
        Optional<Warehouse> warehouse = warehouseRepository.findByRawProductName(request.getIngredientName());
        if (warehouse.isPresent()) {
            throw new DataExitsException(request.getIngredientName() + " already exists!");
        }

        Optional<Category> categoryOpl = categoryRepository.findById(request.getCategoryId());
        if (categoryOpl.isEmpty()) {
            throw new DataExitsException("Category not found!");
        }

        Timestamp expiredDate = Timestamp.valueOf(LocalDateTime.parse(request.getExpiredDate()));
        Timestamp importedDate = Timestamp.valueOf(LocalDateTime.parse(request.getImportedDate()));

        Warehouse _warehouse = Warehouse.builder()
                .ingredientName(request.getIngredientName())
                .category(categoryOpl.get())
                .importedQuantity(request.getImportedQuantity())
                .availableQuantity(request.getImportedQuantity())
                .unit(request.getUnit())
                .expiredDate(expiredDate)
                .importedDate(importedDate)
                .importedPrice(request.getImportedPrice())
                .supplierName(request.getSupplierName())
                .description(request.getDescription())
                .build();
        warehouseRepository.save(_warehouse);
        return new ApiResponse("raw product added successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse importWarehousesFromExcel(MultipartFile file) throws DataExitsException {
        if (!ExcelHelperUtil.isExcelFile(file)) {
            return new ApiResponse("Invalid file format. Please upload an Excel file.", HttpStatus.BAD_REQUEST);
        }

        try {
            List<WarehouseDto> warehouses = ExcelHelperUtil.excelToWarehouseDtos(file.getInputStream());

            for (WarehouseDto warehouseDto : warehouses) {
                addNewWarehouse(warehouseDto);
            }
            return new ApiResponse("Warehouses imported successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ApiResponse("Failed to import warehouses: ", ApiUtil.createErrorDetails(e.getMessage()) , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public ApiResponse updateWarehouse( WarehouseRequest request) throws DataExitsException {
        Optional<Warehouse> warehouseOpt = warehouseRepository.findById(request.getWarehouseId());
        if (warehouseOpt.isEmpty()) {
            throw new DataExitsException("Warehouse not found!");
        }
        Warehouse warehouse = warehouseOpt.get();

        Optional<Warehouse> warehouseWithName = warehouseRepository.findByRawProductName(request.getIngredientName());
        if (warehouseWithName.isPresent() && !warehouseWithName.get().getId().equals(request.getWarehouseId())) {
            throw new DataExitsException("Product name " + request.getIngredientName() + " already exists in another warehouse!");
        }

        Optional<Category> categoryOpt = categoryRepository.findById(request.getCategoryId());
        if (categoryOpt.isEmpty()) {
            throw new DataExitsException("Category not found!");
        }

        Timestamp importedDate = Timestamp.valueOf(LocalDateTime.parse(request.getImportedDate()));
        Timestamp expiredDate = Timestamp.valueOf(LocalDateTime.parse(request.getExpiredDate()));

        warehouse.setIngredientName(request.getIngredientName());
        warehouse.setImportedQuantity(request.getImportedQuantity());
        warehouse.setUnit(request.getUnit());
        warehouse.setImportedDate(importedDate);
        warehouse.setExpiredDate(expiredDate);
        warehouse.setImportedPrice(request.getImportedPrice());
        warehouse.setDescription(request.getDescription());
        warehouse.setSupplierName(request.getSupplierName());
        warehouse.setCategory(categoryOpt.get());

        warehouseRepository.save(warehouse);

        return new ApiResponse("raw product updated successfully", HttpStatus.OK);
    }

    @Override
    public PagedModel<EntityModel<WarehouseResponse>> getAllWarehouses(int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Warehouse> pageResult = warehouseRepository.findAll(paging);
        if(pageResult.hasContent()){
            return pagedResourcesAssembler.toModel(pageResult.map(WarehouseResponse::new));
        } else {
            throw new DataExitsException("No raw product found!");
        }
    }

    @Override
    public ApiResponse deleteWarehouse(String id) throws DataExitsException {
        Optional<Warehouse> warehouseOpt = warehouseRepository.findById(id);
        if (warehouseOpt.isEmpty()) {
            throw new DataExitsException("raw product not found!");
        }
        warehouseRepository.deleteById(id);
        return new ApiResponse("raw product deleted successfully", HttpStatus.OK);
    }
}
