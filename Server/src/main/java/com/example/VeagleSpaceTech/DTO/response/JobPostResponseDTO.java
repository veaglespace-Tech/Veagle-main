package com.example.VeagleSpaceTech.DTO.response;

import java.time.LocalDate;

public record JobPostResponseDTO(
        Long id,
        String title,
        String description,
        String location,
        String skills,
        LocalDate createdAt
) {}
