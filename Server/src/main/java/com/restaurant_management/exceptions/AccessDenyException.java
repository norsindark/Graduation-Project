package com.restaurant_management.exceptions;

public class AccessDenyException extends RuntimeException{
    public AccessDenyException(String message) {
        super(message);
    }
}
