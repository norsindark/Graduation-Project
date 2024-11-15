package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.WarehouseDto;
import com.restaurant_management.entites.Category;
import com.restaurant_management.entites.Warehouse;
import com.restaurant_management.enums.UnitType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.WarehouseRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.GetIngredientNameResponse;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Component
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final CategoryRepository categoryRepository;
    private final PagedResourcesAssembler<WarehouseResponse> pagedResourcesAssembler;

    @Override
    public List<GetIngredientNameResponse> getAllIngredientName() throws DataExitsException {
        List<Warehouse> ingredients = warehouseRepository.findAll();
        if (ingredients.isEmpty()) {
            throw new DataExitsException("No ingredient found!");
        }
        return ingredients.stream()
                .map(GetIngredientNameResponse::new)
                .toList();
    }

    @Override
    @Transactional
    public ApiResponse addNewWarehouse(WarehouseDto request) throws DataExitsException {
        Optional<Warehouse> warehouse = warehouseRepository.findByIngredientName(request.getIngredientName());
        if (warehouse.isPresent()) {
            throw new DataExitsException(request.getIngredientName() + " already exists!");
        }

        Optional<Category> categoryOpl = categoryRepository.findById(request.getCategoryId());
        if (categoryOpl.isEmpty()) {
            throw new DataExitsException("Category not found!");
        }

        UnitType unitType = UnitType.valueOf(request.getUnit().toUpperCase(Locale.ROOT));

        Timestamp expiredDate = request.getExpiredDate();
        Timestamp importedDate = request.getImportedDate();

        if (importedDate.after(expiredDate)) {
            throw new DataExitsException("Imported date must be before expired date!");
        }

        Warehouse _warehouse = Warehouse.builder()
                .ingredientName(request.getIngredientName())
                .category(categoryOpl.get())
                .importedQuantity(request.getImportedQuantity())
                .availableQuantity(request.getImportedQuantity())
                .unit(unitType.getUnit())
                .expiredDate(expiredDate)
                .importedDate(importedDate)
                .importedPrice(request.getImportedPrice())
                .supplierName(request.getSupplierName())
                .description(request.getDescription())
                .build();
        warehouseRepository.save(_warehouse);
        return new ApiResponse("ingredient added successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse importWarehousesFromExcel(MultipartFile file) throws DataExitsException {
        if (!ExcelHelperUtil.isExcelFile(file)) {
            return new ApiResponse("Invalid file format. Please upload an Excel file.", HttpStatus.BAD_REQUEST);
        }

        try {
            ExcelHelperUtil excelHelperUtil = new ExcelHelperUtil(categoryRepository);
            List<WarehouseDto> warehouses = excelHelperUtil.excelToWarehouseDtos(file.getInputStream());

            int successCount = 0;

            for (WarehouseDto warehouseDto : warehouses) {
                addNewWarehouse(warehouseDto);
                successCount++;
            }
            return new ApiResponse(successCount + " ingredient imported successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ApiResponse("Failed to import warehouses: ", ApiUtil.createErrorDetails(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ApiResponse updateWarehouse(WarehouseRequest request) throws DataExitsException {
        Optional<Warehouse> warehouseOpt = warehouseRepository.findById(request.getWarehouseId());
        if (warehouseOpt.isEmpty()) {
            throw new DataExitsException("Warehouse not found!");
        }
        Warehouse warehouse = warehouseOpt.get();
        Optional<Warehouse> warehouseWithName = warehouseRepository.findByIngredientName(request.getIngredientName());
        if (warehouseWithName.isPresent() && !warehouseWithName.get().getId().equals(request.getWarehouseId())) {
            throw new DataExitsException("Product name " + request.getIngredientName() + " already exists in another warehouse!");
        }

        Optional<Category> categoryOpt = categoryRepository.findById(request.getCategoryId());
        if (categoryOpt.isEmpty()) {
            throw new DataExitsException("Category not found!");
        }

        UnitType unitType = UnitType.valueOf(request.getUnit().toUpperCase(Locale.ROOT));

        Timestamp expiredDate = Timestamp.valueOf(LocalDate.parse(request.getExpiredDate()).atStartOfDay());
        Timestamp importedDate = Timestamp.valueOf(LocalDate.parse(request.getImportedDate()).atStartOfDay());

        if (importedDate.after(expiredDate)) {
            throw new DataExitsException("Imported date must be before expired date!");
        }

        warehouse.setIngredientName(request.getIngredientName());
        warehouse.setImportedQuantity(request.getImportedQuantity());
        warehouse.setUnit(unitType.getUnit());
        warehouse.setImportedDate(importedDate);
        warehouse.setExpiredDate(expiredDate);
        warehouse.setImportedPrice(request.getImportedPrice());
        warehouse.setDescription(request.getDescription());
        warehouse.setSupplierName(request.getSupplierName());
        warehouse.setCategory(categoryOpt.get());

        warehouseRepository.save(warehouse);

        return new ApiResponse("ingredient updated successfully", HttpStatus.OK);
    }

    @Override
    public PagedModel<EntityModel<WarehouseResponse>> getAllWarehouses(int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Warehouse> pageResult = warehouseRepository.findAll(paging);
        if (pageResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pageResult.map(WarehouseResponse::new));
        } else {
            throw new DataExitsException("No ingredient found!");
        }
    }

    @Override
    public ApiResponse deleteWarehouse(String id) throws DataExitsException {
        Optional<Warehouse> warehouseOpt = warehouseRepository.findById(id);
        if (warehouseOpt.isEmpty()) {
            throw new DataExitsException("ingredient not found!");
        }
        warehouseRepository.deleteById(id);
        return new ApiResponse("ingredient deleted successfully", HttpStatus.OK);
    }

    @Override
    public PagedModel<EntityModel<WarehouseResponse>> getNearlyExpiredIngredients(
            int daysUntilExpiry, int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {

        Timestamp upcomingDate = Timestamp.from(Instant.now().plus(daysUntilExpiry, ChronoUnit.DAYS));

        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));

        Page<Warehouse> expiredAndNearlyExpiredIngredientsPage = warehouseRepository.findExpiredAndNearlyExpiredIngredients(upcomingDate, paging);

        if (expiredAndNearlyExpiredIngredientsPage.isEmpty()) {
            throw new DataExitsException("No ingredients found that are either nearly expired or expired!");
        }

        return pagedResourcesAssembler.toModel(expiredAndNearlyExpiredIngredientsPage.map(WarehouseResponse::new));
    }


    @Override
    public List<WarehouseResponse> getLowStockIngredients(double percentage) throws DataExitsException {
        List<Warehouse> allIngredients = warehouseRepository.findAll();

        if (allIngredients.isEmpty()) {
            throw new DataExitsException("No ingredients found in the warehouse.");
        }

        List<WarehouseResponse> lowStockIngredients = allIngredients.stream()
                .filter(ingredient -> ingredient.getAvailableQuantity() < (percentage / 100) * ingredient.getImportedQuantity())
                .map(WarehouseResponse::new)
                .collect(Collectors.toList());

        if (lowStockIngredients.isEmpty()) {
            throw new DataExitsException("No low stock ingredients found below " + percentage + "% of imported quantity.");
        }

        return lowStockIngredients;
    }
}
