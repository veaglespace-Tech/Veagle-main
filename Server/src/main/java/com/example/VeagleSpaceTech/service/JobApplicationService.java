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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public List<JobApplicationResponseDTO> getAll() {
        return repo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private JobApplicationResponseDTO mapToDTO(JobApplication app) {
        return new JobApplicationResponseDTO(
                app.getId(),
                app.getName(),
                app.getEmail(),
                app.getPhone(),
                app.getResumeUrl(),
                app.getStatus(),
                app.getCreatedAt(),
                app.getJob() != null ? app.getJob().getId() : null,
                app.getJob() != null ? app.getJob().getTitle() : null
        );
    }

    public List<JobApplicationResponseDTO> getByJob(Long jobId) {
        return repo.findByJobId(jobId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public JobApplicationResponseDTO updateStatus(Long id, ApplicationStatus status) {
        JobApplication app = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);
        JobApplication saved = repo.save(app);

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

    public JobApplicationResponseDTO applyToJob(
            JobApplicationRequestDTO request,
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file is required");
        }

        User user = resolveUser(request.email());

        if (user != null && user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("You are blocked by the organization.");
        }

        JobPost job = jobPostRepo.findById(request.jobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new RuntimeException(
                    "We appreciate your interest, but applications for the position '"
                            + job.getTitle() + "' are no longer being accepted."
            );
        }

        boolean alreadyApplied = repo.existsByEmailAndJobId(request.email(), request.jobId());

        if (alreadyApplied) {
            throw new RuntimeException("You already applied for this job");
        }

        String resumePath = fileService.uploadDocument(file, "resumes");

        JobApplication app = new JobApplication();
        app.setName(request.name());
        app.setEmail(request.email());
        app.setPhone(request.phone());
        app.setResumeUrl(resumePath);
        app.setStatus(ApplicationStatus.APPLIED);
        app.setJob(job);
        app.setUser(user);

        JobApplication saved = repo.save(app);

        emailService.sendApplicationEmail(
                saved.getEmail(),
                saved.getName(),
                job.getTitle()
        );

        return mapToDTO(saved);
    }

    private User resolveUser(String requestEmail) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getName() != null
                && !"anonymousUser".equalsIgnoreCase(authentication.getName())) {
            return userRepo.findByEmail(authentication.getName()).orElse(null);
        }

        return userRepo.findByEmail(requestEmail).orElse(null);
    }
}
