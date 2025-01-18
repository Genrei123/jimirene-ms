package com.jwt.spring_security.controller;

import com.jwt.spring_security.model.Consultation;
import com.jwt.spring_security.repo.ConsultationRepo;
import com.jwt.spring_security.service.QRCodeService;
import com.jwt.spring_security.model.Patient;
import com.jwt.spring_security.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import javax.imageio.ImageIO;

@RestController
public class QRCodeController {

    @Autowired
    private QRCodeService qrCodeService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private ConsultationRepo consultationRepo;

    @GetMapping("/generateqr")
    public ResponseEntity<byte[]> generateQRCode(@RequestParam Long clientID) throws Exception {
        Patient patient = patientService.findById(clientID);

        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        String qrCodeContent = String.valueOf(patient.getClientID());

        BufferedImage qrCodeImage = qrCodeService.generateQRCode(qrCodeContent);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(qrCodeImage, "PNG", byteArrayOutputStream);
        byte[] imageBytes = byteArrayOutputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "image/png");

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/scanqr")
    public ResponseEntity<String> scanQRCode(@RequestParam("file") MultipartFile file) {
        try {
            // Convert MultipartFile to File
            File tempFile = File.createTempFile("qr_", ".png");
            file.transferTo(tempFile);

            // Decode QR Code
            String decodedContent = qrCodeService.decodeQRCode(tempFile);

            if (decodedContent == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No QR Code found in the image.");
            }

            // Return Decoded Content
            return ResponseEntity.ok("Decoded QR Code Content: " + decodedContent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error decoding QR Code: " + e.getMessage());
        }
    }
}
