package com.example.VeagleSpaceTech.DTO.response;

import com.example.VeagleSpaceTech.enums.JobStatus;

import java.time.LocalDate;

public record JobPostResponseDTO(
                Long id,
                String title,
                String description,
                String location,
                String skills,
                JobStatus status,
                LocalDate createdAt) {
}
