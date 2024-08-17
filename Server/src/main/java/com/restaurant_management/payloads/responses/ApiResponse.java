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

    private HttpStatus HttpStatus;

    public ApiResponse(String message, HttpStatus status) {
        this.message = message;
        this.HttpStatus = status;
        this.errors = new HashMap<>();
    }
}
