package com.jwt.spring_security.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
public class RenderedService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Auto select the current date
    private Date serviceDate = new Date();

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // Association with Patient
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToMany
    @JoinTable(
            name = "rendered_service_services",
            joinColumns = @JoinColumn(name = "rendered_service_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Services> services;

    @ManyToMany
    @JoinTable(
            name = "rendered_service_items",
            joinColumns = @JoinColumn(name = "rendered_service_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;

    private Double totalCost;

    private String notes;

    @Column(nullable = false)
    private String status = "active";

    // Getters and Setters
    public Date getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(Date serviceDate) {
        this.serviceDate = serviceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public List<Services> getServices() {
        return services;
    }

    public void setServices(List<Services> services) {
        this.services = services;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
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
