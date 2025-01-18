package com.jwt.spring_security.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate clientID
    private Long clientID;

    @Column(nullable = true, unique = true)
    private String patientID;
    private String imagePath;

    private String lastName;
    private String givenName;
    private String middleName;
    private Character sex;
    private String address;
    private int age;
    private String contactNumber;

    @Temporal(TemporalType.DATE)
    private Date birthday;

    private String religion;
    private String occupation;

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Spouse spouse;

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Pregnancy pregnancy;

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Consultation consultation;

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonManagedReference
    private MedicalHistory medicalHistory;

    @Column(nullable = false)
    private String status = "active"; // Default status is active

    @ManyToOne
    @JoinColumn(name = "branchID", referencedColumnName = "branchID", unique = false)


    private Branch branch;

    // Getters and setters

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public MedicalHistory getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(MedicalHistory medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public String getPatientID() {
        return patientID;
    }

    public void setPatientID(String patientID) {
        this.patientID = patientID;
    }

    public Pregnancy getPregnancy() {
        return pregnancy;
    }

    public void setPregnancy(Pregnancy pregnancy) {
        this.pregnancy = pregnancy;
    }

    public Consultation getConsultation() {
        return consultation;
    }

    public void setConsultation(Consultation consultation) {
        this.consultation = consultation;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Long getClientID() {
        return clientID;
    }

    public void setClientID(Long clientID) {
        this.clientID = clientID;
    }

    public String getVarcharID() {
        return patientID;
    }

    public void setVarcharID(String varcharID) {
        this.patientID = varcharID;
    }

    public Spouse getSpouse() {
        return spouse;
    }

    public void setSpouse(Spouse spouse) {
        this.spouse = spouse;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public Character getMiddleInitial() {
        return middleName.charAt(0);
    }

    public Character getSex() {
        return sex;
    }

    public void setSex(Character sex) {
        this.sex = sex;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }
}
