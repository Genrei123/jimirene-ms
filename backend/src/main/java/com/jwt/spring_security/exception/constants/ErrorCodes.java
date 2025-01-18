package com.jwt.spring_security.exception.constants;
/**
 * Centralized Error Code Management
 *
 * Learning Objectives:
 * 1. Standardize error codes across the application
 * 2. Provide clear, consistent error identification
 * 3. Make error tracking and debugging easier
 */
public final class ErrorCodes {
    // Prevent instantiation
    private ErrorCodes() {}

    // Resource Not Found Error Codes
    public static final class NotFound {
        public static final String EMPLOYEE_NOT_FOUND = "ERR-001";
        public static final String USER_NOT_FOUND = "ERR-002";
        public static final String RESOURCE_NOT_FOUND = "ERR-003";
    }

    // Validation Error Codes
    public static final class Validation {
        public static final String INVALID_INPUT = "VAL-001";
        public static final String CONSTRAINT_VIOLATION = "VAL-002";
        public static final String FIELD_VALIDATION_ERROR = "VAL-003";
    }

    // System Error Codes
    public static final class System {
        public static final String INTERNAL_ERROR = "SYS-001";
        public static final String DATABASE_ERROR = "SYS-002";
        public static final String EXTERNAL_SERVICE_ERROR = "SYS-003";
    }
}
