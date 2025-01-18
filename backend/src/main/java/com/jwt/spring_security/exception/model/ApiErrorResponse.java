package com.jwt.spring_security.exception.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Comprehensive API Error Response Model
 *
 * Learning Objectives:
 * 1. Create a flexible error response structure
 * 2. Support multiple error scenarios
 * 3. Provide rich error context
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    // Core Error Attributes
    private HttpStatus status;
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;

    // Detailed Error Information
    private String title;
    private Object debugInfo;
    private String debugMessage;
    private List<ApiSubError> subErrors;
    private Map<String, Object> metadata;

    // Constructors
    public ApiErrorResponse(HttpStatus status) {
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public ApiErrorResponse(HttpStatus status, String message) {
        this(status);
        this.message = message;
    }

    public ApiErrorResponse(HttpStatus status, String message, String errorCode) {
        this(status, message);
        this.errorCode = errorCode;
    }

    public ApiErrorResponse(String title, String message, Object debugMesage) {
        this.title = title;
        this.message = message;
        this.debugMessage = debugMessage;
    }

    // Builder-style methods for fluent error construction
    public ApiErrorResponse withDebugMessage(String debugMessage) {
        this.debugMessage = debugMessage;
        return this;
    }

    public ApiErrorResponse withSubErrors(List<ApiSubError> subErrors) {
        this.subErrors = subErrors;
        return this;
    }

    public ApiErrorResponse withMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
        return this;
    }

    // Getters (omitted for brevity, but would be included in actual implementation)
    public HttpStatus getStatus() { return status; }
    public String getMessage() { return message; }
    public String getErrorCode() { return errorCode; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getDebugMessage() { return debugMessage; }
    public List<ApiSubError> getSubErrors() { return subErrors; }
    public Map<String, Object> getMetadata() { return metadata; }
}