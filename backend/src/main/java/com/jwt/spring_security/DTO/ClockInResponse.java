package com.jwt.spring_security.DTO;

import java.time.LocalDateTime;

public class ClockInResponse {

    private Long id;
    private String employeeName;
    private Long branchId;
    private LocalDateTime timestamp;

    public ClockInResponse(Long id, String employeeName, Long branchId, LocalDateTime timestamp) {
        this.id = id;
        this.employeeName = employeeName;
        this.branchId = branchId;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
