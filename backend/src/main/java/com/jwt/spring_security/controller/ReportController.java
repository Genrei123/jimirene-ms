package com.jwt.spring_security.controller;

import com.jwt.spring_security.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // API endpoint for monthly check-ins
    @GetMapping("/monthly-checkins")
    public List<Map<String, Object>> getMonthlyCheckIns() {
        return reportService.getMonthlyCheckIns();
    }
}
