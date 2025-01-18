package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Patient;
import com.jwt.spring_security.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    Visit findTopByPatientOrderByVisitDateDesc(Patient patient);
}

