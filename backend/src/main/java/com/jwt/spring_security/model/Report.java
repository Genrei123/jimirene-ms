package com.jwt.spring_security.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reports") // Optional: Specify table name
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    private LocalDate date;
    private int serviceAvailed;
    private int medicineSold;
    private long patientCheckIns; // Change to long
    private long employeeCheckIns; // Change to long

    // Default Constructor
    public Report() {}

    // Parameterized Constructor
    public Report(LocalDate date, int serviceAvailed, int medicineSold, long patientCheckIns, long employeeCheckIns) {
        this.date = date;
        this.serviceAvailed = serviceAvailed >= 0 ? serviceAvailed : 0; // Ensures non-negative values
        this.medicineSold = medicineSold >= 0 ? medicineSold : 0;
        this.patientCheckIns = patientCheckIns >= 0 ? patientCheckIns : 0;
        this.employeeCheckIns = employeeCheckIns >= 0 ? employeeCheckIns : 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getServiceAvailed() {
        return serviceAvailed;
    }

    public void setServiceAvailed(int serviceAvailed) {
        this.serviceAvailed = Math.max(serviceAvailed, 0); // Ensures non-negative values
    }

    public int getMedicineSold() {
        return medicineSold;
    }

    public void setMedicineSold(int medicineSold) {
        this.medicineSold = Math.max(medicineSold, 0);
    }

    public long getPatientCheckIns() {
        return patientCheckIns;
    }

    public void setPatientCheckIns(long patientsCheckIns) {
        this.patientCheckIns = Math.max(patientsCheckIns, 0);
    }

    public long getEmployeeCheckIns() {
        return employeeCheckIns;
    }

    public void setEmployeeCheckIns(long employeeCheckIns) {
        this.employeeCheckIns = Math.max(employeeCheckIns, 0);
    }

    // toString Method
    @Override
    public String toString() {
        return "Report{" +
                "id=" + id +
                ", date=" + date +
                ", serviceAvailed=" + serviceAvailed +
                ", medicineSold=" + medicineSold +
                ", patientsCheckIns=" + patientCheckIns +
                ", employeeCheckIns=" + employeeCheckIns +
                '}';
    }
}
