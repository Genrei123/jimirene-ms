package com.jwt.spring_security.DTO;

import java.util.List;

public class RenderedServiceDTO {
    private Long id;
    private Long patientId;            // Instead of Patient object, just store the patient's ID
    private List<ServiceDTO> services; // A list of simpler DTOs for services
    private List<ItemDTO> items;       // A list of simpler DTOs for items
    private Double totalCost;
    private String notes;

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }
    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public List<ServiceDTO> getServices() {
        return services;
    }
    public void setServices(List<ServiceDTO> services) {
        this.services = services;
    }

    public List<ItemDTO> getItems() {
        return items;
    }
    public void setItems(List<ItemDTO> items) {
        this.items = items;
    }

    public Double getTotalCost() {
        return totalCost;
    }
    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
}

