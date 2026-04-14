package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.JobPostRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.JobPostResponseDTO;
import com.example.VeagleSpaceTech.enums.JobStatus;
import com.example.VeagleSpaceTech.repo.JobPostRepo;
import com.example.VeagleSpaceTech.entity.JobPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        jobPost.setStatus(JobStatus.ACTIVE);

        JobPost jp = jobPostRepo.save(jobPost);

        return new JobPostResponseDTO(
                jp.getId(),
                jp.getTitle(),
                jp.getDescription(),
                jp.getLocation(),
                jp.getSkills(),
                jp.getStatus(),
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
                        job.getStatus(),
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
        existing.setStatus(request.status());

        JobPost jb = jobPostRepo.save(existing);

        return new JobPostResponseDTO(
                jb.getId(),
                jb.getTitle(),
                jb.getDescription(),
                jb.getLocation(),
                jb.getSkills(),
                jb.getStatus(),
                jb.getCreatedAt()
        );
    }

    public String changeStatus(Long id, JobStatus status) {

        JobPost job = jobPostRepo.findById(id).orElseThrow(()-> new RuntimeException("Job Not Found..."));
        job.setStatus(status);
        jobPostRepo.save(job);
        return "Status Changed...";
    }
}
