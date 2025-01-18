package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface reportRepo extends JpaRepository<Report, Long> {

    @Query("SELECT YEAR(p.pregnancy.EDC) AS year, MONTH(p.pregnancy.EDC) AS month, COUNT(p) AS totalPatients " +
            "FROM Patient p GROUP BY YEAR(p.pregnancy.EDC), MONTH(p.pregnancy.EDC)")
    List<Object[]> aggregatePatientCheckIns();


    // Aggregating employee check-ins grouped by year and month
    @Query("SELECT YEAR(e.loginTimeStamp) AS year, MONTH(e.loginTimeStamp) AS month, COUNT(e) AS totalEmployees " +
            "FROM Employee e GROUP BY YEAR(e.loginTimeStamp), MONTH(e.loginTimeStamp)")
    List<Object[]> aggregateEmployeeCheckIns();
}
