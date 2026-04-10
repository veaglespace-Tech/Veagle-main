package com.example.VeagleSpaceTech.DTO.request;

import jakarta.validation.constraints.NotBlank;

public record PortfolioRequestDTO(

        @NotBlank(message = "Title is required")
        String title,
        String description,
        String projectUrl,
        String githubUrl

) {}