package com.jwt.spring_security.service;

import com.jwt.spring_security.model.Branch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchService {
    @Autowired
    com.jwt.spring_security.repo.branchRepo branchRepo;

    public Branch findBranch(Long id) {
        return branchRepo.findByBranchID(id);
    }

    public Branch saveBranch(Branch branch) {
        return branch;
    }

    public boolean deleteByBranchID(Long id) {
        if (branchRepo.existsById(id)) {
            branchRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public void softDeleteBranch(Long branchID) {
        Branch branch = branchRepo.findByBranchID(branchID);
        branch.setDeleted(true);
        branchRepo.save(branch);
    }

    public ResponseEntity<List<Branch>> getAllActiveBranches() {
        return ResponseEntity.ok(branchRepo.findByDeletedFalse());
    }

}
