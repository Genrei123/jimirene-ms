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

//    @PostMapping("/uploadPatientImage")
//    public ResponseEntity<?> uploadPatientImage(@RequestParam("file") MultipartFile file,
//                                                @RequestParam("patientId") Long patientId) {
//        try {
//            // Check if patient exists
//            Patient patient = patientRepo.findById(patientId)
//                    .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + patientId));
//
//            if (file.isEmpty()) {
//                return ResponseEntity.badRequest().body("No file was uploaded.");
//            }
//
//            // Upload the file to Imgur
//            String imageUrl = uploadImageToImgur(file);
//            if (imageUrl == null) {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload to Imgur.");
//            }
//
//            // Save the returned image URL in the patient record
//            patient.setImagePath(imageUrl);
//            patientRepo.save(patient);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "Image uploaded successfully");
//            response.put("imagePath", imageUrl);
//
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to upload image: " + e.getMessage());
//        }
//    }
//
//    private String uploadImageToImgur(MultipartFile file) {
//        try {
//            RestTemplate restTemplate = new RestTemplate();
//
//            // Set headers
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//            headers.set("Authorization", "Client-ID " + imgurClientId);
//
//            // Build the body
//            MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
//            body.add("image", new org.springframework.core.io.ByteArrayResource(file.getBytes()) {
//                @Override
//                public String getFilename() {
//                    return file.getOriginalFilename();
//                }
//            });
//
//            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
//
//            // Imgur Upload Endpoint
//            ResponseEntity<Map> response = restTemplate.exchange(
//                    "https://api.imgur.com/3/image",
//                    HttpMethod.POST,
//                    requestEntity,
//                    Map.class
//            );
//
//            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
//                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
//                if (data != null && data.get("link") != null) {
//                    return data.get("link").toString();
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return null;
//    }

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
