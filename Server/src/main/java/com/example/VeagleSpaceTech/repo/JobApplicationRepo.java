package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobId(Long jobId);

    List<JobApplication> findAllByOrderByCreatedAtDesc();

    boolean existsByEmailAndJobId(String email, Long aLong);
}
