package com.jwt.spring_security.controller;

import com.jwt.spring_security.model.Patient;
import com.jwt.spring_security.model.Visit;
import com.jwt.spring_security.repo.VisitRepository;
import com.jwt.spring_security.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@RestController
public class VisitController {
    @Autowired
    private PatientService patientService;

    @Autowired
    private VisitRepository visitRepository;

    @PostMapping("/addPatientLog")
    public ResponseEntity<String> addVisit(@RequestParam Long patientId, @RequestParam String purpose) {
        try {
            // Fetch the patient by ID
            Patient patient = patientService.findById(patientId);

            // If the patient is not found, return a 404 Not Found response
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found.");
            }

            // Check if the patient already has a visit logged today
            Visit lastVisit = visitRepository.findTopByPatientOrderByVisitDateDesc(patient);

            if (lastVisit != null && isSameDay(lastVisit.getVisitDate())) { // Prevent logging a visit today
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Visit already logged for today.");
            }

            // Create a new Visit log
            Visit visit = new Visit();
            visit.setPatient(patient); // Link the visit to the patient
            visit.setPurpose(purpose); // Set the purpose of the visit
            visit.setVisitDate(new Date()); // Set the visit date (current date and time)

            // Save the new Visit
            visitRepository.save(visit);

            return ResponseEntity.ok("Visit logged successfully for Patient ID: " + patientId);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error logging visit: " + e.getMessage());
        }
    }

    // Helper method to check if the visit date is today
    private boolean isSameDay(Date visitDate) {
        LocalDate today = LocalDate.now();
        LocalDate visitLocalDate = visitDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return visitLocalDate.isEqual(today);
    }



}
