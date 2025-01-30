package com.jwt.spring_security.controller;

import com.jwt.spring_security.DTO.ConsultationDTO;
import com.jwt.spring_security.DTO.PatientDTO;
import com.jwt.spring_security.model.Patient;
import com.jwt.spring_security.model.RenderedService;
import com.jwt.spring_security.repo.PatientRepo;
import com.jwt.spring_security.repo.RenderedServiceRepository;
import com.jwt.spring_security.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class PatientController {

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private PatientService patientService;

    @Autowired
    private RenderedServiceRepository renderedServiceRepository;

    @PostMapping("/addPatient")
    public ResponseEntity<Patient> addPatient(@RequestBody PatientDTO patientDTO) {
        Long clientID = patientService.addPatient(patientDTO);
        return ResponseEntity.ok(patientRepo.findById(clientID).get());
    }

    @GetMapping("/getPatient")
    public ResponseEntity<?> getAllPatients() {
        List<Patient> patients = patientRepo.findAll();
        if (patients.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No patients found.");
        }
        return ResponseEntity.ok(patients);
    }

    @PatchMapping("/archivePatient/{id}")
    public ResponseEntity<?> archivePatient(@PathVariable Long id) {
        Optional<Patient> patientOptional = patientRepo.findById(id);
        if (patientOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient with ID " + id + " not found.");
        }

        Patient patient = patientOptional.get();
        patient.setStatus("archived");
        patientRepo.save(patient);

        return ResponseEntity.ok("Patient with ID " + id + " archived successfully.");
    }

    @PatchMapping("/unarchivePatient/{id}")
    public ResponseEntity<?> unarchivePatient(@PathVariable Long id) {
        Optional<Patient> patientOptional = patientRepo.findById(id);
        if (patientOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient with ID " + id + " not found.");
        }

        Patient patient = patientOptional.get();
        patient.setStatus("active");
        patientRepo.save(patient);

        return ResponseEntity.ok("Patient with ID " + id + " unarchived successfully.");
    }

    @GetMapping("/searchPatients")
    public ResponseEntity<?> searchPatients(@RequestParam String query) {
        List<Patient> patients = patientRepo.findByGivenNameAndStatus(query, "active");
        if (patients.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active patients found with the given name: " + query);
        }
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/getPatient/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Long id) {
        Optional<Patient> patientOpt = patientRepo.findById(id);
        if (patientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient with ID " + id + " not found.");
        }

        return ResponseEntity.ok(patientOpt.get());
    }

    @PatchMapping("/updatePatient")
    public ResponseEntity<?> updatePatient(@Validated @RequestBody Patient patient) {
        // Check if patient exists
        if (!patientRepo.existsById(patient.getClientID())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient with ID " + patient.getClientID() + " not found.");
        }

        // Update patient details
        Patient updatedPatient = patientRepo.save(patient);
        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/deletePatient/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        // Check if patient exists
        if (!patientRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient with ID " + id + " not found.");
        }

        // Delete patient
        patientRepo.deleteById(id);
        return ResponseEntity.ok("Patient with ID " + id + " deleted successfully.");
    }
}
