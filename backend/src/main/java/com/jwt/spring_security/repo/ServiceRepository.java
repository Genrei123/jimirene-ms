package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Service;
import com.jwt.spring_security.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Services, Long> {


}
