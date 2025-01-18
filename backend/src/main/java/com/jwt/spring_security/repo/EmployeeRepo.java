package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long> {

    // Custom query to find employee by employeeID
    Employee findByEmployeeID(int employeeID);

    // Custom query to check if an email already exists in the database
    boolean existsByEmail(String email);
}
