package com.jwt.spring_security.DTO;

public class MedicalHistoryDTO {
    private Long medicalHistoryId;
    private Long patientId; // Referencing patient ID instead of the entire Patient object
    private boolean smoking;
    private String allergies;
    private boolean drugIntake;
    private boolean bleedingAnemia;
    private boolean diabetesCongenitalAnomalies;
    private boolean previousCSection;
    private boolean consecutiveMiscarriages;
    private boolean postPartumHemorrhage;
    private boolean forcepDelivery;
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
        return drugIntake;
    }

    public void setDrugIntake(boolean drugIntake) {
        this.drugIntake = drugIntake;
    }

    public boolean isBleedingAnemia() {
        return bleedingAnemia;
    }

    public void setBleedingAnemia(boolean bleedingAnemia) {
        this.bleedingAnemia = bleedingAnemia;
    }

    public boolean isDiabetesCongenitalAnomalies() {
        return diabetesCongenitalAnomalies;
    }

    public void setDiabetesCongenitalAnomalies(boolean diabetesCongenitalAnomalies) {
        this.diabetesCongenitalAnomalies = diabetesCongenitalAnomalies;
    }

    public boolean isPreviousCSection() {
        return previousCSection;
    }

    public void setPreviousCSection(boolean previousCSection) {
        this.previousCSection = previousCSection;
    }

    public boolean isConsecutiveMiscarriages() {
        return consecutiveMiscarriages;
    }

    public void setConsecutiveMiscarriages(boolean consecutiveMiscarriages) {
        this.consecutiveMiscarriages = consecutiveMiscarriages;
    }

    public boolean isPostPartumHemorrhage() {
        return postPartumHemorrhage;
    }

    public void setPostPartumHemorrhage(boolean postPartumHemorrhage) {
        this.postPartumHemorrhage = postPartumHemorrhage;
    }

    public boolean isForcepDelivery() {
        return forcepDelivery;
    }

    public void setForcepDelivery(boolean forcepDelivery) {
        this.forcepDelivery = forcepDelivery;
    }

    public boolean isHypertension() {
        return hypertension;
    }

    public void setHypertension(boolean hypertension) {
        this.hypertension = hypertension;
    }
}

