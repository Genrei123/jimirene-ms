package com.jwt.spring_security.DTO;

public class MedicalHistoryDTO {
    private Long medicalHistoryId;
    private Long patientId; // Referencing patient ID instead of the entire Patient object
    private boolean smoking;
    private String allergies;
    private boolean drug_intake;
    private boolean bleeding_anemia;
    private boolean diabetes_congenital_anomalies;
    private boolean previous_C_section;
    private boolean consecutive_miscarriages;
    private boolean post_partum_hemorrhage;
    private boolean forcep_delivery;
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

