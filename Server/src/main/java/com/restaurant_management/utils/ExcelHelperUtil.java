package com.restaurant_management.utils;

import com.restaurant_management.dtos.WarehouseDto;
import com.restaurant_management.entites.Category;
import com.restaurant_management.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class ExcelHelperUtil {

    private final CategoryRepository categoryRepository;

    public static boolean isExcelFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    public List<WarehouseDto> excelToWarehouseDtos(InputStream is) {
        List<WarehouseDto> warehouseDtos = new ArrayList<>();
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                if (isRowEmpty(currentRow)) {
                    break;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();
                WarehouseDto warehouseDto = new WarehouseDto();

                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        case 0:
                            warehouseDto.setIngredientName(currentCell.getStringCellValue());
                            break;
                        case 1:
                            warehouseDto.setImportedQuantity(currentCell.getNumericCellValue());
                            break;
                        case 2:
                            warehouseDto.setUnit(currentCell.getStringCellValue());
                            break;
                        case 3:
                            warehouseDto.setImportedDate(Timestamp.valueOf(currentCell.getStringCellValue()));
                            break;
                        case 4:
                            warehouseDto.setExpiredDate(Timestamp.valueOf(currentCell.getStringCellValue()));
                            break;
                        case 5:
                            warehouseDto.setImportedPrice(currentCell.getNumericCellValue());
                            break;
                        case 6:
                            warehouseDto.setDescription(currentCell.getStringCellValue());
                            break;
                        case 7:
                            warehouseDto.setSupplierName(currentCell.getStringCellValue());
                            break;
                        case 8:
                            String categoryName = currentCell.getStringCellValue();
                            String categoryId = getCategoryIdByName(categoryName);
                            warehouseDto.setCategoryId(categoryId);
                            break;
                        default:
                            break;
                    }
                    cellIdx++;
                }
                warehouseDtos.add(warehouseDto);
            }
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException("Fail to parse Excel file: " + e.getMessage());
        }
        return warehouseDtos;
    }

    private static boolean isRowEmpty(Row row) {
        for (Cell cell : row) {
            if (cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private String getCategoryIdByName(String categoryName) {
        Optional<Category> category = categoryRepository.findByName(categoryName);
        if (category.isPresent()) {
            return category.get().getId();
        } else {
            return "Unknown";
        }
    }
}
