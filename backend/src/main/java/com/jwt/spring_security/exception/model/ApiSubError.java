package com.jwt.spring_security.exception.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Flexible Sub-Error Representation
 *
 * Learning Objectives:
 * 1. Create a base class for different error types
 * 2. Support granular error reporting
 * 3. Provide extensible error details
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class ApiSubError {
    // Base class for different types of sub-errors
}

