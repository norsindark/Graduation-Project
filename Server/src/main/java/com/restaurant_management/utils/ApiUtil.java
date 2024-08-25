package com.restaurant_management.utils;

import java.util.HashMap;
import java.util.Map;

public class ApiUtil {
    public static Map<String, String> createErrorDetails(String errorMessage) {
        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("error", errorMessage);
        return errorDetails;
    }

    public static Map<String, String> createDataDetails(String name, String errorMessage) {
        Map<String, String> dataDetails = new HashMap<>();
        dataDetails.put(name, errorMessage);
        return dataDetails;
    }
}
