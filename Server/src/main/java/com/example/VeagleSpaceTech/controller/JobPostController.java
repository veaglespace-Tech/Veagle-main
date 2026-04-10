package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.JobApplicationRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.JobPostRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.JobApplicationResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.JobPostResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.PageResponse;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.model.UserPrincipal;
import com.example.VeagleSpaceTech.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

// send jobPosts
//    @GetMapping("/api/jobs")
//    public ResponseEntity<PageResponse<JobPostResponseDTO>> getJobs(
//            @RequestParam(required = false) String keyword,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int size
//    ) {
//        Page<JobPostResponseDTO> pageData = jobPostService.getJobs(keyword, page, size);
//
//        PageResponse<JobPostResponseDTO> response = new PageResponse<>(
//                pageData.getContent(),
//                pageData.getTotalPages(),
//                pageData.getTotalElements(),
//                pageData.getNumber()
//        );
//        return ResponseEntity.ok(response);
//    }


    // Fetch All JobPosts and SearchBased on it
    @GetMapping("/api/jobs")
    public ResponseEntity<List<JobPostResponseDTO>> getJobs(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(jobPostService.getJobs(keyword));
    }

    // Add a Job in DB
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/jobs")
    public ResponseEntity<JobPostResponseDTO> addJob(@RequestBody JobPostRequestDTO request) {
        return ResponseEntity.status(201).body(jobPostService.addJob(request));
    }

    // Delete Job From DB
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/jobs/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        jobPostService.delete(id);
        return ResponseEntity.ok("Job deleted successfully");
    }

    // Update Job From DB
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/jobs/{id}")
    public ResponseEntity<JobPostResponseDTO> update(
            @RequestBody JobPostRequestDTO request,
            @PathVariable Long id) {

        return ResponseEntity.ok(jobPostService.update(request, id));
    }


    // Apply to job (logged-in user required)
    @PostMapping(value = "/careers/apply", consumes = "multipart/form-data")
    public ResponseEntity<JobApplicationResponseDTO> apply(

            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam Long jobId,

            @RequestParam("file") MultipartFile file,

            @AuthenticationPrincipal UserPrincipal principal

    ) {
        User user = principal != null ? principal.getUser() : null;

        JobApplicationRequestDTO request =
                new JobApplicationRequestDTO(name, email, phone, jobId);

        return ResponseEntity.ok(
                jobPostService.applyToJob(request, file, user)
        );
    }





}
