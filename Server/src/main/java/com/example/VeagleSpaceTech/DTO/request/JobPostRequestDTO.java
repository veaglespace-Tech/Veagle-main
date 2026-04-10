package com.example.VeagleSpaceTech.DTO.request;

import jakarta.validation.constraints.NotBlank;

public record JobPostRequestDTO(

//        @NotBlank(message = "Title is required")
        String title,

//        @NotBlank(message = "Description is required")
        String description,

//        @NotBlank(message = "Location is required")
        String location,

//        @NotBlank(message = "Skills are required")
        String skills

) {}
