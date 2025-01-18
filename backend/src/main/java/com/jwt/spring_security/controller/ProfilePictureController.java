package com.jwt.spring_security.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ProfilePictureController {

    @PostMapping("/upload-profile-picture")
    public String uploadProfilePicture(@RequestParam("profilePicture") MultipartFile file) {
        String uploadDir = "/";
        File uploadFolder = new File(uploadDir);

        if (!uploadFolder.exists()) {
            // Create the directory if it does not exist
            boolean created = uploadFolder.mkdirs();
            if (!created) {
                return "Failed to create directory for file upload";
            }
        }

        try {
            String filePath = uploadDir + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            // Save file path to database as needed
            return "File uploaded successfully: " + filePath;
        } catch (IOException e) {
            return "File upload failed: " + e.getMessage();
        }
    }
}

