package com.jwt.spring_security.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Spouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long spouse_id;

    @OneToOne
    @JoinColumn(name = "clientID", referencedColumnName = "clientID")
    @JsonBackReference
    private Patient patient;

    private String spouse_name;
    private Date spouse_birthday;
    private String spouse_religion;
    private String spouse_occupation;
    private String spouse_contact_number;
    private Integer spouse_age;

    @Column(nullable = false)
    private boolean deleted = false;

    // Getter for spouse_id
    public Long getSpouse_id() {
        return spouse_id;
    }

    // Setter for spouse_id
    public void setSpouse_id(Long spouse_id) {
        this.spouse_id = spouse_id;
    }

    // Getter for patient
    public Patient getPatient() {
        return patient;
    }

    // Setter for patient
    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    // Getter for spouse_name
    public String getSpouse_name() {
        return spouse_name;
    }

    // Setter for spouse_name
    public void setSpouse_name(String spouse_name) {
        this.spouse_name = spouse_name;
    }

    // Getter for spouse_birthday
    public Date getSpouse_birthday() {
        return spouse_birthday;
    }

    // Setter for spouse_birthday
    public void setSpouse_birthday(Date spouse_birthday) {
        this.spouse_birthday = spouse_birthday;
    }

    // Getter for spouse_religion
    public String getSpouse_religion() {
        return spouse_religion;
    }

    // Setter for spouse_religion
    public void setSpouse_religion(String spouse_religion) {
        this.spouse_religion = spouse_religion;
    }

    // Getter for spouse_occupation
    public String getSpouse_occupation() {
        return spouse_occupation;
    }

    // Setter for spouse_occupation
    public void setSpouse_occupation(String spouse_occupation) {
        this.spouse_occupation = spouse_occupation;
    }

    // Getter for spouse_contact_number
    public String getSpouse_contact_number() {
        return spouse_contact_number;
    }

    // Setter for spouse_contact_number
    public void setSpouse_contact_number(String spouse_contact_number) {
        this.spouse_contact_number = spouse_contact_number;
    }

    public int getSpouse_age() {
        return spouse_age;
    }

    public void setSpouse_age(int spouse_age) {
        this.spouse_age = spouse_age;
    }
}
