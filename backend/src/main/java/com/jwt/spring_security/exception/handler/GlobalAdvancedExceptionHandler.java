package com.jwt.spring_security.exception.handler;

import com.jwt.spring_security.exception.constants.ErrorCodes;
import com.jwt.spring_security.exception.custom.ResourceNotFoundException;
import com.jwt.spring_security.exception.custom.ValidationErrorException;
import com.jwt.spring_security.exception.model.ApiErrorResponse;
import com.jwt.spring_security.exception.model.ApiSubError;
import com.jwt.spring_security.exception.model.ApiValidationError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Centralized Global Exception Handler
 *
 * Learning Objectives:
 * 1. Create a comprehensive exception handling mechanism
 * 2. Handle different types of exceptions
 * 3. Provide consistent error responses
 */
@ControllerAdvice
public class GlobalAdvancedExceptionHandler {

    /**
     * Handle Resource Not Found Exceptions
     * Provides detailed information about missing resources
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage()); // 400 Bad Request
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex,
            WebRequest request
    ) {
        ApiErrorResponse error = new ApiErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                ex.getErrorCode()
        ).withMetadata(Map.of(
                "resource", ex.getResourceName(),
                "field", ex.getFieldName(),
                "value", ex.getFieldValue()
        ));

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle Validation Errors
     * Captures and reports multiple validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex
    ) {
        List<ApiSubError> subErrors = new ArrayList<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError fieldError) {
                subErrors.add(new ApiValidationError(
                        fieldError.getObjectName(),
                        fieldError.getField(),
                        fieldError.getRejectedValue(),
                        fieldError.getDefaultMessage()
                ));
            }
        });

        ApiErrorResponse errorResponse = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                ErrorCodes.Validation.FIELD_VALIDATION_ERROR
        ).withSubErrors(subErrors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle Custom Validation Error Exceptions
     * Supports custom validation error scenarios
     */
    @ExceptionHandler(ValidationErrorException.class)
    public ResponseEntity<ApiErrorResponse> handleCustomValidationErrors(
            ValidationErrorException ex
    ) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                ex.getMessage(),
                ex.getErrorCode(),
                HttpStatus.BAD_REQUEST
                ).withSubErrors(new ArrayList<>(ex.getValidationErrors())); // Explicit conversion if needed

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Catch-All Generic Exception Handler
     * Provides a safety net for unexpected errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception ex,
            WebRequest request
    ) {
        ApiErrorResponse error = new ApiErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred",
                ErrorCodes.System.INTERNAL_ERROR
        ).withMetadata(Map.of(
                "exceptionType", ex.getClass().getSimpleName(),
                "exceptionMessage", ex.getMessage()
        ));

        // Log the full error details (use proper logging in production)
        ex.printStackTrace();

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}