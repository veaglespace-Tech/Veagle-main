package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.JobApplicationRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.JobPostRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.JobApplicationResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.JobPostResponseDTO;
import com.example.VeagleSpaceTech.entity.JobApplication;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.enums.ApplicationStatus;
import com.example.VeagleSpaceTech.repo.JobApplicationRepo;
import com.example.VeagleSpaceTech.repo.JobPostRepo;
import com.example.VeagleSpaceTech.entity.JobPost;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class JobPostService {

    @Autowired
    private JobPostRepo jobPostRepo;

    public JobPostResponseDTO addJob(JobPostRequestDTO request) {

        JobPost jobPost = new JobPost();
        jobPost.setTitle(request.title());
        jobPost.setDescription(request.description());
        jobPost.setLocation(request.location());
        jobPost.setSkills(request.skills());
//        jobPost.setCreatedAt();

        JobPost jp = jobPostRepo.save(jobPost);

        return new JobPostResponseDTO(
                jp.getId(),
                jp.getTitle(),
                jp.getDescription(),
                jp.getLocation(),
                jp.getSkills(),
                jp.getCreatedAt()
        );
    }

    // Fetch All JobPosts
    public List<JobPostResponseDTO> getJobs(String keyword) {

        List<JobPost> jobs;

        if (keyword == null || keyword.trim().isEmpty()) {
            jobs = jobPostRepo.findAll();  // ✅ ALL DATA
        } else {
            jobs = jobPostRepo.searchWithPriority(keyword);
        }

        return jobs.stream()
                .map(job -> new JobPostResponseDTO(
                        job.getId(),
                        job.getTitle(),
                        job.getDescription(),
                        job.getLocation(),
                        job.getSkills(),
                        job.getCreatedAt()
                ))
                .toList();
    }

//
//public Page<JobPostResponseDTO> getJobs(String keyword, int page, int size) {
//
//    size = Math.min(size, 20); // limit max size
//
//    Pageable pageable = PageRequest.of(page, size);
//
//    Page<JobPost> jobPage;
//
//    //  Main Logic (Search OR All)
//    if (keyword == null || keyword.trim().isEmpty()) {
//        jobPage = jobPostRepo.findAll(pageable);
//    } else {
//        jobPage = jobPostRepo.searchWithPriority(keyword, pageable);
//    }
//
//    //  Handle overflow page
//    if (page >= jobPage.getTotalPages() && jobPage.getTotalPages() > 0) {
//        pageable = PageRequest.of(jobPage.getTotalPages() - 1, size);
//
//        if (keyword == null || keyword.trim().isEmpty()) {
//            jobPage = jobPostRepo.findAll(pageable);
//        } else {
//            jobPage = jobPostRepo.searchWithPriority(keyword, pageable);
//        }
//    }
//
//    //  Entity → DTO
//    return jobPage.map(job -> new JobPostResponseDTO(
//            job.getId(),
//            job.getTitle(),
//            job.getDescription(),
//            job.getLocation(),
//            job.getSkills()
//    ));
//}

 // Delete Job
    public void delete(Long id) {

        if (!jobPostRepo.existsById(id)) {
            throw new RuntimeException("Job not found with id: " + id);
        }

        jobPostRepo.deleteById(id);
    }

    public JobPostResponseDTO update(JobPostRequestDTO request, Long id) {

        JobPost existing = jobPostRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        // update only fields (safe way)
        existing.setTitle(request.title());
        existing.setDescription(request.description());
        existing.setLocation(request.location());
        existing.setSkills(request.skills());

        JobPost jb = jobPostRepo.save(existing);

        return new JobPostResponseDTO(
                jb.getId(),
                jb.getTitle(),
                jb.getDescription(),
                jb.getLocation(),
                jb.getSkills(),
                jb.getCreatedAt()
        );
    }


    // Make Changes Regarding JobApplications
    @Autowired
    private JobApplicationRepo jobApplicationRepo;

    // For Storing Files (Resume)
    @Autowired
    private FileService fileService;

    // Applied To Job
    public JobApplicationResponseDTO applyToJob(JobApplicationRequestDTO request,MultipartFile file,
            User user // can be null
    ) {

        // 1️⃣ Get Job
        JobPost job = jobPostRepo.findById(request.jobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // 2️⃣ Upload Resume
        String resumePath = fileService.upload(file,"resumes");

        // 3️⃣ Create Application
        JobApplication app = new JobApplication();

        // Snapshot data (always from request)
        app.setName(request.name());
        app.setEmail(request.email());
        app.setPhone(request.phone());

        app.setResumeUrl(resumePath);
        app.setStatus(ApplicationStatus.APPLIED);
        app.setJob(job);

        // 4️⃣ Handle user (IMPORTANT)
        app.setUser(user); // null = guest, object = logged-in

        // 5️⃣ Save
        JobApplication saved = jobApplicationRepo.save(app);

//        System.out.println("\n "+saved);
//        System.out.println("\n "+saved.getJob()+"\n "+ saved.getJob().getId());

        // 6️⃣ Return response
        return new JobApplicationResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getResumeUrl(),
                saved.getStatus(),
                saved.getCreatedAt(),
                saved.getJob().getId(),
                saved.getJob().getTitle()
        );
    }



}
