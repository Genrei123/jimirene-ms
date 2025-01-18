package com.jwt.spring_security.repo;

import com.jwt.spring_security.DTO.ClockInRequest;
import com.jwt.spring_security.model.ClockIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClockInRepository extends JpaRepository<ClockIn, Long> {
}
