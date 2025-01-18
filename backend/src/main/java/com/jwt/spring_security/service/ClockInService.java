package com.jwt.spring_security.service;

import com.jwt.spring_security.DTO.ClockInRequest;
import com.jwt.spring_security.DTO.ClockInResponse;
import com.jwt.spring_security.model.ClockIn;
import com.jwt.spring_security.repo.ClockInRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClockInService {

    private final ClockInRepository clockInRepository;

    public ClockInService(ClockInRepository clockInRepository) {
        this.clockInRepository = clockInRepository;
    }

    public void saveClockIn(ClockInRequest request) {
        ClockIn clockIn = new ClockIn();
        clockIn.setEmployeeId(request.getEmployeeId());
        clockIn.setBranchId(request.getBranchId());
        clockIn.setTimestamp(LocalDateTime.now());
        clockInRepository.save(clockIn);
    }

    public List<ClockInResponse> getAllClockIns() {
        return clockInRepository.findAll().stream()
                .map(clockIn -> new ClockInResponse(
                        clockIn.getId(),
                        clockIn.getEmployeeId(),
                        clockIn.getBranchId(),
                        clockIn.getTimestamp()
                ))
                .collect(Collectors.toList());
    }
}
