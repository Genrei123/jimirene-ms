package com.jwt.spring_security.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MedicalHistoryDTO {
    @JsonProperty("medical_history_id")
    private Long medicalHistoryId;
    @JsonProperty("patient_id")
    private Long patientId; // Referencing patient ID instead of the entire Patient object
    @JsonProperty("smoking")
    private boolean smoking;
    @JsonProperty("allergies")
    private String allergies;
    @JsonProperty("drug_intake")
    private boolean drug_intake;
    @JsonProperty("bleeding_anemia")
    private boolean bleeding_anemia;
    @JsonProperty("diabetes_congenital_anomalies")
    private boolean diabetes_congenital_anomalies;
    @JsonProperty("previous_C_section")
    private boolean previous_C_section;
    @JsonProperty("consecutive_miscarriages")
    private boolean consecutive_miscarriages;
    @JsonProperty("post_partum_hemorrhage")
    private boolean post_partum_hemorrhage;
    @JsonProperty("forcep_delivery")
    private boolean forcep_delivery;
    @JsonProperty("hypertension")
    private boolean hypertension;

    // Getters and Setters
    public Long getMedicalHistoryId() {
        return medicalHistoryId;
    }

    public void setMedicalHistoryId(Long medicalHistoryId) {
        this.medicalHistoryId = medicalHistoryId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
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

    public boolean isDrugIntake() {
        return drug_intake;
    }

    public void setDrugIntake(boolean drugIntake) {
        this.drug_intake = drugIntake;
    }

    public boolean isBleedingAnemia() {
        return bleeding_anemia;
    }

    public void setBleedingAnemia(boolean bleedingAnemia) {
        this.bleeding_anemia = bleedingAnemia;
    }

    public boolean isDiabetesCongenitalAnomalies() {
        return diabetes_congenital_anomalies;
    }

    public void setDiabetesCongenitalAnomalies(boolean diabetesCongenitalAnomalies) {
        this.diabetes_congenital_anomalies = diabetesCongenitalAnomalies;
    }

    public boolean isPreviousCSection() {
        return previous_C_section;
    }

    public void setPreviousCSection(boolean previousCSection) {
        this.previous_C_section = previousCSection;
    }

    public boolean isConsecutiveMiscarriages() {
        return consecutive_miscarriages;
    }

    public void setConsecutiveMiscarriages(boolean consecutiveMiscarriages) {
        this.consecutive_miscarriages = consecutiveMiscarriages;
    }

    public boolean isPostPartumHemorrhage() {
        return post_partum_hemorrhage;
    }

    public void setPostPartumHemorrhage(boolean postPartumHemorrhage) {
        this.post_partum_hemorrhage = postPartumHemorrhage;
    }

    public boolean isForcepDelivery() {
        return forcep_delivery;
    }

    public void setForcepDelivery(boolean forcepDelivery) {
        this.forcep_delivery = forcepDelivery;
    }

    public boolean isHypertension() {
        return hypertension;
    }

    public void setHypertension(boolean hypertension) {
        this.hypertension = hypertension;
    }
}

