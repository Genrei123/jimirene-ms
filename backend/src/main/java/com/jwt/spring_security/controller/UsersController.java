package com.jwt.spring_security.controller;

import com.jwt.spring_security.model.Users;
import com.jwt.spring_security.repo.UserRepo;
import com.jwt.spring_security.response.UserResponse;
import com.jwt.spring_security.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;

@RestController
public class UsersController {

    @Autowired
    UsersService usersService;

    @Autowired
    UserRepo userRepo;

    @PostMapping("/register")
    public Users registerUser(@RequestBody Users user) {
        // Validate role before registration
        if (!"ADMIN".equalsIgnoreCase(user.getRole()) &&
                !"EMPLOYEE".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid role. Must be ADMIN or EMPLOYEE"
            );
        }
        return usersService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        String token = usersService.verify(user);

        // Extract the role from the authenticated user
        Users authenticatedUser = usersService.findByUsername(user.getUsername());

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("token", token);
            put("role", authenticatedUser.getRole().toLowerCase());
            put("username", authenticatedUser.getUsername());
        }});
    }

    @GetMapping("/read/{username}")
    public ResponseEntity<Users> readByUsername(@PathVariable String username) {
        Users user = usersService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update/{username}")
    public ResponseEntity<Users> updateUser(@PathVariable String username, @RequestBody Users userDetails) {
        Users updatedUser = usersService.updateUserByUsername(username, userDetails);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/delete/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        boolean isRemoved = usersService.deleteUserByUsername(username);
        if (!isRemoved) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public List<Users> getAllUsers() {
        return userRepo.findAll();
    }


}
