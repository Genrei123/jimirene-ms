package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {

    // Add methods for this repo if necessary
    Users findByUsername(String username);
}
