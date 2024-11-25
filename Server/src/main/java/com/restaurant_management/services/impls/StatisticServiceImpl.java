package com.restaurant_management.services.impls;

import com.restaurant_management.entites.Dish;
import com.restaurant_management.entites.Recipe;
import com.restaurant_management.entites.Warehouse;
import com.restaurant_management.enums.UnitType;
import com.restaurant_management.payloads.responses.StatisticResponse;
import com.restaurant_management.payloads.responses.StatisticUserResponse;
import com.restaurant_management.repositories.OrderItemRepository;
import com.restaurant_management.repositories.OrderRepository;
import com.restaurant_management.repositories.RecipeRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.StatisticService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Override
    public StatisticResponse getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    @Override
    public Map<String, Long> getDishSalesStatistics() {
        List<Map<String, Long>> results = orderItemRepository.getDishSalesStatistics();

        Map<String, Long> dishSalesStatistics = new HashMap<>();
        for (Map<String, Long> result : results) {
            dishSalesStatistics.put(String.valueOf(result.get("dishName")), result.get("totalQuantity"));
        }

        return dishSalesStatistics;
    }

    @Override
    public Map<String, Map<String, Map<String, Double>>> getDishSalesRevenueAndProfitByMonth() {
        List<Map<String, Object>> monthlyRevenueResults = orderItemRepository.getDishSalesRevenueByMonth();
        List<Recipe> recipes = recipeRepository.findAll();

        Map<Dish, List<Recipe>> recipesByDish = recipes.stream()
                .collect(Collectors.groupingBy(Recipe::getDish));

        Map<String, Map<String, Map<String, Double>>> dishStatisticsByMonth = new HashMap<>();

        for (Map.Entry<Dish, List<Recipe>> entry : recipesByDish.entrySet()) {
            Dish dish = entry.getKey();
            List<Recipe> dishRecipes = entry.getValue();

            Map<String, Double> stats = calculateDishStats(dish, dishRecipes, monthlyRevenueResults, "month");

            monthlyRevenueResults.stream()
                    .filter(result -> result.get("dishName").equals(dish.getDishName()))
                    .forEach(result -> {
                        int month = (int) result.get("month");
                        int year = (int) result.get("year");
                        String monthKey = month + "-" + year;
                        dishStatisticsByMonth
                                .computeIfAbsent(monthKey, k -> new HashMap<>())
                                .put(dish.getDishName(), stats);
                    });
        }

        return dishStatisticsByMonth;
    }


    @Override
    public Map<String, Map<String, Map<String, Double>>> getDishSalesRevenueAndProfitByWeek() {
        List<Map<String, Object>> weeklyRevenueResults = orderItemRepository.getDishSalesRevenueByWeek();
        List<Recipe> recipes = recipeRepository.findAll();

        Map<Dish, List<Recipe>> recipesByDish = recipes.stream()
                .collect(Collectors.groupingBy(Recipe::getDish));

        Map<String, Map<String, Map<String, Double>>> dishStatisticsByWeek = new HashMap<>();

        for (Map.Entry<Dish, List<Recipe>> entry : recipesByDish.entrySet()) {
            Dish dish = entry.getKey();
            List<Recipe> dishRecipes = entry.getValue();

            Map<String, Double> stats = calculateDishStats(dish, dishRecipes, weeklyRevenueResults, "week");

            weeklyRevenueResults.stream()
                    .filter(result -> result.get("dishName").equals(dish.getDishName()))
                    .forEach(result -> {
                        int week = (int) result.get("week");
                        int year = (int) result.get("year");
                        String weekKey = "W" + week + "-" + year;
                        dishStatisticsByWeek
                                .computeIfAbsent(weekKey, k -> new HashMap<>())
                                .put(dish.getDishName(), stats);
                    });
        }

        return dishStatisticsByWeek;
    }


    @Override
    public Map<String, Map<String, Double>> getDishSalesRevenueAndProfit() {
        List<Recipe> recipes = recipeRepository.findAll();

        Map<Dish, List<Recipe>> recipesByDish = recipes.stream()
                .collect(Collectors.groupingBy(Recipe::getDish));

        List<Map<String, Object>> revenueResults = orderItemRepository.getDishSalesRevenue();

        Map<String, Map<String, Double>> dishStatistics = new HashMap<>();

        for (Map.Entry<Dish, List<Recipe>> entry : recipesByDish.entrySet()) {
            Dish dish = entry.getKey();
            List<Recipe> dishRecipes = entry.getValue();

            Map<String, Double> stats = calculateDishStats(dish, dishRecipes, revenueResults, "total");

            dishStatistics.put(dish.getDishName(), stats);
        }

        return dishStatistics;
    }


    @Override
    public StatisticUserResponse getTotalUserStatistics() {
        Long totalUser = userRepository.countTotalUsers();
        Long userToday = userRepository.countToDayUsers(Timestamp.valueOf(LocalDate.now().atStartOfDay()));

        StatisticUserResponse statisticUserResponse = new StatisticUserResponse();
        statisticUserResponse.setTotalUser(totalUser);
        statisticUserResponse.setUserToday(userToday);


        return statisticUserResponse;
    }

    @NotNull
    private Map<String, Double> calculateDishStats(Dish dish, List<Recipe> dishRecipes, List<Map<String, Object>> revenueResults, String timeKey) {
        double totalCost = 0.0;

        for (Recipe recipe : dishRecipes) {
            Warehouse warehouse = recipe.getWarehouse();
            Double quantityUsed = recipe.getQuantityUsed();
            String recipeUnit = recipe.getUnit();
            String warehouseUnit = warehouse.getUnit();

            double convertedQuantityUsed = UnitType.convert(quantityUsed, UnitType.fromString(recipeUnit), UnitType.fromString(warehouseUnit));
            double costPerUnit = warehouse.getImportedPrice();
            totalCost += costPerUnit * convertedQuantityUsed;
        }

        String dishName = dish.getDishName();
        double finalTotalCost = totalCost;

        Map<String, Double> stats = new HashMap<>();
        revenueResults.stream()
                .filter(result -> result.get("dishName").equals(dishName))
                .forEach(result -> {
                    double revenue = (double) result.get("totalRevenue");
                    Long totalQuantitySold = (Long) result.get("totalQuantitySold");
                    int totalQuantitySoldInt = totalQuantitySold != null ? totalQuantitySold.intValue() : 0;

                    double updatedCost = finalTotalCost * totalQuantitySoldInt;
                    double profit = revenue - updatedCost;

                    stats.put("totalRevenue", revenue);
                    stats.put("totalCost", updatedCost);
                    stats.put("profit", profit);
                });

        return stats;
    }

}
