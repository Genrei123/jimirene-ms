package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepo extends JpaRepository<Patient, Long> {
    List<Patient> findPatientByGivenName(String given_name);
    @Query("SELECT p FROM Patient p WHERE p.status = 'active'")
    List<Patient> findActivePatients();
    List<Patient> findByGivenNameAndStatus(String givenName, String status);
    Optional<Patient> findByPatientID(String patientID);
}
