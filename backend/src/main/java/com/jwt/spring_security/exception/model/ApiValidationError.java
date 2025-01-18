package com.jwt.spring_security.exception.model;

import com.fasterxml.jackson.annotation.JsonInclude;

// Concrete implementation for validation errors
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiValidationError extends ApiSubError {
    private String object;
    private String field;
    private Object rejectedValue;
    private String message;

    // Constructors
    public ApiValidationError(String object, String message) {
        this.object = object;
        this.message = message;
    }

    public ApiValidationError(
            String object,
            String field,
            Object rejectedValue,
            String message
    ) {
        this.object = object;
        this.field = field;
        this.rejectedValue = rejectedValue;
        this.message = message;
    }

    // Getters (omitted for brevity)
}
