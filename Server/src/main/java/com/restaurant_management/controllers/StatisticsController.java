package com.restaurant_management.controllers;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.services.interfaces.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Statistics API")
@RequestMapping("/api/v1/dashboard/statistics")
public class StatisticsController {
    private final OrderService orderService;

    @GetMapping("order/get-dish-sales-statistics")
    @Operation(summary = "get dish sales statistics", tags = {"Order"})
    public ResponseEntity<?> getDishSalesStatistics() throws DataExitsException {
        return ResponseEntity.ok(orderService.getDishSalesStatistics());
    }

    @GetMapping("order/get-dish-sales-revenue-profit")
    @Operation(summary = "get dish sales revenue and profit", tags = {"Order"})
    public ResponseEntity<?> getDishSalesRevenueAndProfit() {
        return ResponseEntity.ok(orderService.getDishSalesRevenueAndProfit());
    }

    @GetMapping("order/get-dish-sales-revenue-profit-by-month")
    @Operation(summary = "get dish sales revenue and profit by month", tags = {"Order"})
    public ResponseEntity<?> getDishSalesRevenueAndProfitByMonth() {
        return ResponseEntity.ok(orderService.getDishSalesRevenueAndProfitByMonth());
    }

    @GetMapping("order/get-dish-sales-revenue-profit-by-week")
    @Operation(summary = "get dish sales revenue and profit by week", tags = {"Order"})
    public ResponseEntity<?> getDishSalesRevenueAndProfitByWeek() {
        return ResponseEntity.ok(orderService.getDishSalesRevenueAndProfitByWeek());
    }
}
