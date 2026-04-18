package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.JobPostRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.JobPostResponseDTO;
import com.example.VeagleSpaceTech.enums.JobStatus;
import com.example.VeagleSpaceTech.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;

    // send jobPosts
    // @GetMapping("/api/jobs")
    // public ResponseEntity<PageResponse<JobPostResponseDTO>> getJobs(
    // @RequestParam(required = false) String keyword,
    // @RequestParam(defaultValue = "0") int page,
    // @RequestParam(defaultValue = "5") int size
    // ) {
    // Page<JobPostResponseDTO> pageData = jobPostService.getJobs(keyword, page,
    // size);
    //
    // PageResponse<JobPostResponseDTO> response = new PageResponse<>(
    // pageData.getContent(),
    // pageData.getTotalPages(),
    // pageData.getTotalElements(),
    // pageData.getNumber()
    // );
    // return ResponseEntity.ok(response);
    // }

    // Fetch All JobPosts and SearchBased on it
    @GetMapping("/api/public/jobs")
    public ResponseEntity<List<JobPostResponseDTO>> getJobs(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(jobPostService.getJobs(keyword));
    }

    // Add a Job in DB
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PostMapping("/api/admin/jobs")
    public ResponseEntity<JobPostResponseDTO> addJob(@RequestBody JobPostRequestDTO request) {
        return ResponseEntity.status(201).body(jobPostService.addJob(request));
    }

    // Update Job From DB
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PutMapping("/api/admin/jobs/{id}")
    public ResponseEntity<JobPostResponseDTO> update(
            @RequestBody JobPostRequestDTO request,
            @PathVariable Long id) {

        return ResponseEntity.ok(jobPostService.update(request, id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PatchMapping("/api/admin/jobs/{id}/status")
    public ResponseEntity<String> changeStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status) {
        // System.out.println("ID: " + id + " Status: " + status);
        return ResponseEntity.ok(jobPostService.changeStatus(id, status));
    }

    // Delete Job From DB
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @DeleteMapping("/api/admin/jobs/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        jobPostService.delete(id);
        return ResponseEntity.ok("Job deleted successfully");
    }

}
