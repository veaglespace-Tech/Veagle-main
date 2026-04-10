package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepo extends JpaRepository<JobApplication,Long> {
}
