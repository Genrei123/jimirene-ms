package com.jwt.spring_security.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class SpouseDTO {
    @JsonProperty("spouse_id")  // Add this to match GET response
    private Long spouseId;

    @JsonProperty("spouse_name")
    private String spouseName;

    @JsonProperty("spouse_birthday")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date spouseBirthday;

    @JsonProperty("spouse_religion")
    private String spouseReligion;

    @JsonProperty("spouse_occupation")
    private String spouseOccupation;

    @JsonProperty("spouse_contact_number")
    private String spouseContactNumber;

    @JsonProperty("spouse_age")
    private Integer spouseAge;

    public String getSpouseName() {
        return spouseName;
    }

    public void setSpouseName(String spouseName) {
        this.spouseName = spouseName;
    }

    public Date getSpouseBirthday() {
        return spouseBirthday;
    }

    public void setSpouseBirthday(Date spouseBirthday) {
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

