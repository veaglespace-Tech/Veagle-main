package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.JobApplicationRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.JobApplicationResponseDTO;
import com.example.VeagleSpaceTech.entity.JobApplication;
import com.example.VeagleSpaceTech.entity.JobPost;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.enums.ApplicationStatus;
import com.example.VeagleSpaceTech.enums.JobStatus;
import com.example.VeagleSpaceTech.enums.UserStatus;
import com.example.VeagleSpaceTech.repo.JobApplicationRepo;
import com.example.VeagleSpaceTech.repo.JobPostRepo;
import com.example.VeagleSpaceTech.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepo repo;

    @Autowired
    private JobPostRepo jobPostRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private FileService fileService;

    //  Get All Applications

    public List<JobApplicationResponseDTO> getAll() {
        return repo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Map Method JobApplication -> JobApplicationResponseDTO
    private JobApplicationResponseDTO mapToDTO(JobApplication app) {
        String baseUrl = "http://localhost:8080/";
        return new JobApplicationResponseDTO(
                app.getId(),
                app.getName(),
                app.getEmail(),
                app.getPhone(),
                baseUrl + app.getResumeUrl(),
                app.getStatus(),
                app.getCreatedAt(),
                app.getJob() != null ? app.getJob().getId() : null,
                app.getJob() != null ? app.getJob().getTitle() : null
        );
    }

    //  Get Applications by Job
    public List<JobApplicationResponseDTO> getByJob(Long jobId) {
        return repo.findByJobId(jobId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }



    //  Update Status
    public JobApplicationResponseDTO updateStatus(Long id, ApplicationStatus status) {

        JobApplication app = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);

        JobApplication saved = repo.save(app);

        // 🔥 Send Email Based on Status
        if (status == ApplicationStatus.SELECTED) {
            emailService.sendSelectedEmail(
                    saved.getEmail(),
                    saved.getName(),
                    saved.getJob().getTitle()
            );
        } else if (status == ApplicationStatus.REJECTED) {
            emailService.sendRejectedEmail(
                    saved.getEmail(),
                    saved.getName(),
                    saved.getJob().getTitle()
            );
        }

        return mapToDTO(saved);
    }

    // Applied To Job
    public JobApplicationResponseDTO applyToJob(
            JobApplicationRequestDTO request,
            MultipartFile file,
            String email
    ) {
        // 1. Validate file
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file is required");
        }

        // Get User
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Registered..."));

        //   Check User is Blocked or Not
//        System.out.println("\n Status      "+user.getStatus());
        if (user != null && user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("You are blocked by the organization.");
        }

        // 2. Get job
        JobPost job = jobPostRepo.findById(request.jobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new RuntimeException(
                    "We appreciate your interest, but applications for the position '"
                            + job.getTitle() + "' are no longer being accepted."
            );
        }

        // 3. Prevent duplicate apply
        boolean alreadyApplied = repo
                .existsByEmailAndJobId(request.email(), request.jobId());

        if (alreadyApplied) {
            throw new RuntimeException("You already applied for this job");
        }

        // 4. Upload resume
        String resumePath = fileService.upload(file, "resumes");

        // 5. Create application
        JobApplication app = new JobApplication();
        app.setName(request.name());
        app.setEmail(request.email());
        app.setPhone(request.phone());
        app.setResumeUrl(resumePath);
        app.setStatus(ApplicationStatus.APPLIED);
        app.setJob(job);
        app.setUser(user);

        // 6. Save
        JobApplication saved = repo.save(app);

        //  Email Send
        emailService.sendApplicationEmail(
                saved.getEmail(),
                saved.getName(),
                job.getTitle()
        );

        // 7. Response
        return new JobApplicationResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getResumeUrl(),
                saved.getStatus(),
                saved.getCreatedAt(),
                job.getId(),
                job.getTitle()
        );
    }

}
