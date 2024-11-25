package com.restaurant_management.services.interfaces;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.StatisticResponse;
import com.restaurant_management.payloads.responses.StatisticUserResponse;

import java.util.Map;

public interface StatisticService {

    StatisticResponse getTotalRevenue() throws DataExitsException;

    Map<String, Long> getDishSalesStatistics() throws DataExitsException;

    Map<String, Map<String, Double>> getDishSalesRevenueAndProfit();

    Map<String, Map<String, Map<String, Double>>> getDishSalesRevenueAndProfitByMonth();

    Map<String, Map<String, Map<String, Double>>> getDishSalesRevenueAndProfitByWeek();

    StatisticUserResponse getTotalUserStatistics() throws DataExitsException;
}
