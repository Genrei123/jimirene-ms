package com.jwt.spring_security.exception.custom;

import com.jwt.spring_security.exception.constants.ErrorCodes;

/**
 * Generic Resource Not Found Exception
 *
 * Learning Objectives:
 * 1. Create a reusable exception for missing resources
 * 2. Provide context about the missing resource
 * 3. Support multiple resource types
 */
public class ResourceNotFoundException extends RuntimeException {
    private String resourceName;
    private String fieldName;
    private Object fieldValue;
    private String errorCode;

    // Constructors
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format(
                "%s not found with %s : '%s'",
                resourceName, fieldName, fieldValue
        ));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.errorCode = ErrorCodes.NotFound.RESOURCE_NOT_FOUND;
    }

    // Overloaded constructor with custom error code
    public ResourceNotFoundException(
            String resourceName,
            String fieldName,
            Object fieldValue,
            String customErrorCode
    ) {
        this(resourceName, fieldName, fieldValue);
        this.errorCode = customErrorCode;
    }

    // Getters
    public String getResourceName() { return resourceName; }
    public String getFieldName() { return fieldName; }
    public Object getFieldValue() { return fieldValue; }
    public String getErrorCode() { return errorCode; }
}