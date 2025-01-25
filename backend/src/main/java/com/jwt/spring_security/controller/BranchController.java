package com.jwt.spring_security.controller;
import com.jwt.spring_security.exception.model.ApiErrorResponse;
import com.jwt.spring_security.model.Branch;
import com.jwt.spring_security.service.BranchService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
public class BranchController {
    @Autowired
    private BranchService branchService;

    @Autowired
    private com.jwt.spring_security.repo.branchRepo branchRepo;

    @PostMapping("/addBranch")
    public ResponseEntity<?> addBranch(@RequestBody @Validated Branch branch) {
        // No need to check for branch ID existence here, since the ID is auto-incremented
        return ResponseEntity.ok(branchRepo.save(branch));
    }


    @GetMapping("/branches")
    public ResponseEntity<List<Branch>> getAllBranches() {
        return branchService.getAllActiveBranches();
    }

    @GetMapping("/readBranch/{id}")
    public ResponseEntity<?> getBranch(@PathVariable Long id) {
        Branch branch = branchRepo.findByBranchID(id);
        if (branch == null) {
            return ResponseEntity.status(404)
                    .body(new ApiErrorResponse("Not Found", "Branch with ID " + id + " not found", id));
        }
        return ResponseEntity.ok(branch);
    }

    @PutMapping("/updateBranch/{id}")
    public ResponseEntity<?> updateBranch(@PathVariable Long id, @RequestBody @Validated Branch branchDetails) {
        Branch existingBranch = branchRepo.findByBranchID(id);
        if (existingBranch == null) {
            return ResponseEntity.status(404)
                    .body(new ApiErrorResponse("Not Found", "Branch with ID " + id + " not found", id));
        }
        branchDetails.setBranchID(existingBranch.getBranchID());
        return ResponseEntity.ok(branchRepo.save(branchDetails));
    }

    @PutMapping("/deleteBranch/{id}")
    public ResponseEntity<?> softDeleteBranch(@PathVariable Long id) {
        Branch branch = branchRepo.findByBranchID(id);
        if (branch == null) {
            return ResponseEntity.status(404)
                    .body(new ApiErrorResponse("Not Found", "Branch with ID " + id + " not found", id));
        }
        branch.setDeleted(true);
        return ResponseEntity.ok(branchRepo.save(branch));
    }
}

