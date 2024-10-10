package com.restaurant_management.exceptions;

import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.utils.ApiUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AccessDenyException.class)
    public ResponseEntity<ErrorDetails> accessDenyException(AccessDenyException e, WebRequest request){

        ErrorDetails errorDetails = new ErrorDetails(new Date(),
                e.getMessage(),request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse> handleExpiredJwtException(ExpiredJwtException e) {
        ApiResponse apiResponse = new ApiResponse("JWT token is expired!",HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(apiResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleException(Exception e) {
        ApiResponse apiResponse = new ApiResponse("An error occurred!", ApiUtil.createErrorDetails(e.getMessage()), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }
}
