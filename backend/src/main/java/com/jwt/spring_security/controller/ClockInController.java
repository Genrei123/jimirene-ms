package com.jwt.spring_security.controller;

import com.jwt.spring_security.DTO.ClockInRequest;
import com.jwt.spring_security.DTO.ClockInResponse;
import com.jwt.spring_security.service.ClockInService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clock-in")
public class ClockInController {

    private final ClockInService clockInService;

    public ClockInController(ClockInService clockInService) {
        this.clockInService = clockInService;
    }

    @PostMapping
    public ResponseEntity<?> clockIn(@RequestBody ClockInRequest request) {
        clockInService.saveClockIn(request);
        return ResponseEntity.ok("Clock-in successful");
    }

    @GetMapping
    public ResponseEntity<List<ClockInResponse>> getAllClockIns() {
        List<ClockInResponse> clockIns = clockInService.getAllClockIns();
        return ResponseEntity.ok(clockIns);
    }


}

