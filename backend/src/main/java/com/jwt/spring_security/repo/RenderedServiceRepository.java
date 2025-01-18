package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.RenderedService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RenderedServiceRepository extends JpaRepository<RenderedService, Long> {
    @Query("SELECT rs FROM RenderedService rs WHERE rs.patient.clientID = :patientId")
    List<RenderedService> findByPatientId(Long patientId);


}
