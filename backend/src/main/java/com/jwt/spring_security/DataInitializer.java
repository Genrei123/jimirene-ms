package com.jwt.spring_security;

import com.jwt.spring_security.model.Owner;
import com.jwt.spring_security.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Override
    public void run(String... args) {
        // Check if an Owner account already exists
        if (userRepo.findByUsername("owner") == null) {
            // Create a new Owner account
            Owner owner = new Owner();
            owner.setUsername("owner"); // Default username
            owner.setPassword(new BCryptPasswordEncoder().encode("owner1234")); // Default password
            owner.setRole("owner"); // Ensure the role is OWNER
            owner.setOwnerID("OWNER001");
            owner.setEmail("genreypogi@gmail.com");

            // Save the Owner to the database
            userRepo.save(owner);
            System.out.println("Default Owner account created with username: 'owner' and password: 'owner123'");
        }

        // Dummy employee account
        if (userRepo.findByUsername("employee") == null) {
            Owner employee = new Owner();
            employee.setUsername("employee");
            employee.setPassword(new BCryptPasswordEncoder().encode("employee1234"));
            employee.setRole("employee");
            employee.setOwnerID("EMPLOYEE001");
            employee.setEmail("genreycristobal03@gmail.com");

            userRepo.save(employee);
            System.out.println("Default Employee account created with username: 'employee' and password: 'employee123'");
        }
    }
}
