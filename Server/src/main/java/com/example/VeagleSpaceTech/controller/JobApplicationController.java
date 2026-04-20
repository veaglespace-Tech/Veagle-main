package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.JobApplicationRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.JobApplicationResponseDTO;
import com.example.VeagleSpaceTech.enums.ApplicationStatus;
import com.example.VeagleSpaceTech.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    // Apply to job (Guest + Logged-in both allowed)
    @PostMapping(value = "/api/user/applications", consumes = "multipart/form-data")
    public ResponseEntity<JobApplicationResponseDTO> apply(

            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam Long jobId,
            @RequestParam("file") MultipartFile file) {

        JobApplicationRequestDTO request =
                new JobApplicationRequestDTO(name, email, phone, null, jobId, null);

        return ResponseEntity.ok(
                jobApplicationService.applyToJob(request, file)
        );
    }

    // Admin apis
    // Get All Job Applications
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @GetMapping("/api/admin/applications")
    public ResponseEntity<List<JobApplicationResponseDTO>> getAllApplications() {
        return ResponseEntity.status(200).body(jobApplicationService.getAll());
    }

    // Get Job Application By Id
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @GetMapping("/api/admin/applications/job/{jobId}")
    public ResponseEntity<List<JobApplicationResponseDTO>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.status(200).body(jobApplicationService.getByJob(jobId));
    }

    // Update Job Application Status
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PatchMapping("/api/admin/applications/{id}/status")
    public ResponseEntity<JobApplicationResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status
    ) {
        return ResponseEntity.ok(jobApplicationService.updateStatus(id, status));
    }




}
