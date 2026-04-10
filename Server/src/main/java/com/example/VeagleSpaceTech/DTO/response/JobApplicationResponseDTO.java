package com.example.VeagleSpaceTech.DTO.response;

import com.example.VeagleSpaceTech.enums.ApplicationStatus;

import java.time.LocalDateTime;

public record JobApplicationResponseDTO(
        Long id,
        String name,
        String email,
        String phone,
        String resumeUrl,
        ApplicationStatus status,
        LocalDateTime createdAt,
        Long jobId,
        String jobTitle
) {}