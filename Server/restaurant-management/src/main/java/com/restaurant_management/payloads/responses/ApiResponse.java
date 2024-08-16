package com.restaurant_management.payloads.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class ApiResponse {

    private String message;

    private Map<String, String> errors;

    private HttpStatus status;

    public ApiResponse(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
        this.errors = new HashMap<>();
    }
}
