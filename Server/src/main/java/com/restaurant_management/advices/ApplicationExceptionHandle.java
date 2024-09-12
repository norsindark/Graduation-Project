package com.restaurant_management.advices;

import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.utils.ApiUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandle {

//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    @ResponseBody
//    public ResponseEntity<ApiResponse> handleInvalidArgument(MethodArgumentNotValidException e) {
//        Map<String, String> errors = new HashMap<>();
//        e.getBindingResult().getAllErrors().forEach(error -> {
//            String errorMessage = error.getDefaultMessage();
//            errors.put("error", errorMessage);
//        });
//        ApiResponse apiResponse = new ApiResponse("Validation error occurred",errors, HttpStatus.BAD_REQUEST);
//        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
//    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<ApiResponse> handleInvalidArgument(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        StringBuilder errorMessageBuilder = new StringBuilder();
        e.getBindingResult().getAllErrors().forEach(error -> {
            String errorMessage = error.getDefaultMessage();
            if (!errorMessageBuilder.isEmpty()) {
                errorMessageBuilder.append(", ");
            }
            errorMessageBuilder.append(errorMessage);
        });
        errors.put("error", errorMessageBuilder.toString());
        ApiResponse apiResponse = new ApiResponse("Validation error occurred", errors, HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(DataExitsException.class)
    @ResponseBody
    public ResponseEntity<ApiResponse> handleSignInException(DataExitsException e) {
        ApiResponse apiResponse = new ApiResponse("An Error: ", ApiUtil.createErrorDetails(e.getMessage()) , HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        ApiResponse apiResponse = new ApiResponse("Validation error: ",ApiUtil.createErrorDetails( e.getMessage()), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "You do not have permission to access this resource.");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }
}
