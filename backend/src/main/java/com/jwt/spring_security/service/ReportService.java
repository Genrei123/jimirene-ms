package com.jwt.spring_security.service;

import com.jwt.spring_security.repo.reportRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private reportRepo reportRepository;

    public List<Map<String, Object>> getMonthlyCheckIns() {
        // Fetch aggregated data for patients and employees
        List<Object[]> patientResults = reportRepository.aggregatePatientCheckIns();

        // Map for temporary aggregation
        Map<YearMonth, Map<String, Long>> aggregatedData = new HashMap<>();

        // Process patient data
        for (Object[] result : patientResults) {
            int year = (int) result[0];
            int month = (int) result[1];
            long totalPatients = (long) result[2];

            YearMonth yearMonth = YearMonth.of(year, month);
            aggregatedData.computeIfAbsent(yearMonth, k -> new HashMap<>())
                    .put("patientCheckIns", totalPatients);
        }

        // Convert to a list of maps for the response
        List<Map<String, Object>> monthlyCheckIns = new ArrayList<>();
        for (Map.Entry<YearMonth, Map<String, Long>> entry : aggregatedData.entrySet()) {
            YearMonth yearMonth = entry.getKey();
            Map<String, Long> counts = entry.getValue();

            Map<String, Object> reportData = new HashMap<>();
            reportData.put("yearMonth", yearMonth.toString());
            reportData.put("patientCheckIns", counts.getOrDefault("patientCheckIns", 0L));
            reportData.put("employeeCheckIns", counts.getOrDefault("employeeCheckIns", 0L));

            monthlyCheckIns.add(reportData);
        }

        return monthlyCheckIns;
    }
}
