package com.jwt.spring_security.repo;

import com.jwt.spring_security.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface branchRepo extends JpaRepository<Branch, Long> {
    Branch findByBranchID(Long id);
    Branch findByBranchName(String branchName);
    List<Branch> findByDeletedFalse();
}
