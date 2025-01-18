package com.jwt.spring_security.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class MedicalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medical_history_id;

    @OneToOne
    @JoinColumn(name = "clientID", referencedColumnName = "clientID")
    @JsonBackReference
    private Patient patient;

    private boolean smoking;
    private String allergies;
    private boolean drug_intake;
    private boolean bleeding_anemia;
    private boolean diabetes_congenital_anomalies;
    private boolean Previous_C_section;

    private boolean consectuive_miscarriages;
    private boolean post_partum_hemorrhage;
    private boolean forcep_delivery;
    private boolean hypertension;



    public Long getMedical_history_id() {
        return medical_history_id;
    }

    public void setMedical_history_id(Long medical_history_id) {
        this.medical_history_id = medical_history_id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public boolean isSmoking() {
        return smoking;
    }

    public void setSmoking(boolean smoking) {
        this.smoking = smoking;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public boolean isDrug_intake() {
        return drug_intake;
    }

    public void setDrug_intake(boolean drug_intake) {
        this.drug_intake = drug_intake;
    }

    public boolean isBleeding_anemia() {
        return bleeding_anemia;
    }

    public void setBleeding_anemia(boolean bleeding_anemia) {
        this.bleeding_anemia = bleeding_anemia;
    }

    public boolean isDiabetes_congenital_anomalies() {
        return diabetes_congenital_anomalies;
    }

    public void setDiabetes_congenital_anomalies(boolean diabetes_congenital_anomalies) {
        this.diabetes_congenital_anomalies = diabetes_congenital_anomalies;
    }

    public boolean isPrevious_C_section() {
        return Previous_C_section;
    }

    public void setPrevious_C_section(boolean previous_C_section) {
        Previous_C_section = previous_C_section;
    }

    public boolean isConsectuive_miscarriages() {
        return consectuive_miscarriages;
    }

    public void setConsectuive_miscarriages(boolean consectuive_miscarriages) {
        this.consectuive_miscarriages = consectuive_miscarriages;
    }

    public boolean isPost_partum_hemorrhage() {
        return post_partum_hemorrhage;
    }

    public void setPost_partum_hemorrhage(boolean post_partum_hemorrhage) {
        this.post_partum_hemorrhage = post_partum_hemorrhage;
    }

    public boolean isForcep_delivery() {
        return forcep_delivery;
    }

    public void setForcep_delivery(boolean forcep_delivery) {
        this.forcep_delivery = forcep_delivery;
    }

    public boolean isHypertension() {
        return hypertension;
    }

    public void setHypertension(boolean hypertension) {
        this.hypertension = hypertension;
    }
}
