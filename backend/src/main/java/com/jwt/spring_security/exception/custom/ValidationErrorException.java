package com.jwt.spring_security.exception.custom;

import com.jwt.spring_security.exception.constants.ErrorCodes;
import com.jwt.spring_security.exception.model.ApiValidationError;

import java.util.List;

/**
 * Comprehensive Validation Error Exception
 *
 * Learning Objectives:
 * 1. Create a flexible validation error exception
 * 2. Support multiple validation errors
 * 3. Provide detailed validation feedback
 */
public class ValidationErrorException extends RuntimeException {
    private List<ApiValidationError> validationErrors;
    private String errorCode;

    public ValidationErrorException(List<ApiValidationError> validationErrors) {
        super("Validation failed");
        this.validationErrors = validationErrors;
        this.errorCode = ErrorCodes.Validation.FIELD_VALIDATION_ERROR;
    }

    public ValidationErrorException(
            List<ApiValidationError> validationErrors,
            String customErrorCode
    ) {
        this(validationErrors);
        this.errorCode = customErrorCode;
    }

    // Getters
    public List<ApiValidationError> getValidationErrors() { return validationErrors; }
    public String getErrorCode() { return errorCode; }
}