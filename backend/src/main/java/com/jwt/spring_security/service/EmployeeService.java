package com.jwt.spring_security.service;

import com.jwt.spring_security.model.Employee;
import com.jwt.spring_security.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    // Save new employee with encrypted password
    public Employee save(Employee employee) {
        employee.setPassword(new BCryptPasswordEncoder().encode(employee.getPassword()));
        return employeeRepo.save(employee);
    }

    // Fetch all employees
    public List<Employee> findAll() {
        return employeeRepo.findAll();
    }

    // Find employee by employeeID
    public Employee findByEmployeeID(int employeeID) {
        return employeeRepo.findByEmployeeID(employeeID);
    }

    // Find employee by ID
    public Optional<Employee> findByID(Long id) {
        return employeeRepo.findById(id);
    }

    // Check if employee exists by employeeID
    public boolean existsByEmployeeID(int employeeID) {
        return employeeRepo.findByEmployeeID(employeeID) != null;
    }

    // Delete employee by employeeID
    public boolean deleteByEmployeeID(int employeeID) {
        Employee employee = employeeRepo.findByEmployeeID(employeeID);
        if (employee != null) {
            employeeRepo.delete(employee);  // Delete by employee entity
            return true;
        }
        return false;
    }

    // Update existing employee details
    public Employee updateEmployee(int employeeID, Employee employeeDetails) {
        Employee existingEmployee = employeeRepo.findByEmployeeID(employeeID);
        if (existingEmployee == null) {
            return null;
        }

        existingEmployee.setUsername(employeeDetails.getUsername());
        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setRole(employeeDetails.getRole());
        return employeeRepo.save(existingEmployee);
    }
}
