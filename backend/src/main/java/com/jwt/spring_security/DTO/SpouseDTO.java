package com.jwt.spring_security.DTO;

public class SpouseDTO {
    private String spouseName;
    private String spouseBirthday; // Nullable
    private String spouseReligion; // Nullable
    private String spouseOccupation; // Nullable
    private String spouseContactNumber; // Nullable
    private Integer spouseAge; // Nullable

    public String getSpouseName() {
        return spouseName;
    }

    public void setSpouseName(String spouseName) {
        this.spouseName = spouseName;
    }

    public String getSpouseBirthday() {
        return spouseBirthday;
    }

    public void setSpouseBirthday(String spouseBirthday) {
        this.spouseBirthday = spouseBirthday;
    }

    public String getSpouseReligion() {
        return spouseReligion;
    }

    public void setSpouseReligion(String spouseReligion) {
        this.spouseReligion = spouseReligion;
    }

    public String getSpouseOccupation() {
        return spouseOccupation;
    }

    public void setSpouseOccupation(String spouseOccupation) {
        this.spouseOccupation = spouseOccupation;
    }

    public String getSpouseContactNumber() {
        return spouseContactNumber;
    }

    public void setSpouseContactNumber(String spouseContactNumber) {
        this.spouseContactNumber = spouseContactNumber;
    }

    public Integer getSpouseAge() {
        return spouseAge;
    }

    public void setSpouseAge(Integer spouseAge) {
        this.spouseAge = spouseAge;
    }
}

