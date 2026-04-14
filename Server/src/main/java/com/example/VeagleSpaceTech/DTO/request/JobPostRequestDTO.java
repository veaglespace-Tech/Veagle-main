package com.example.VeagleSpaceTech.DTO.request;

import com.example.VeagleSpaceTech.enums.JobStatus;

public record JobPostRequestDTO(

//        @NotBlank(message = "Title is required")
        String title,

//        @NotBlank(message = "Description is required")
        String description,

//        @NotBlank(message = "Location is required")
        String location,

//        @NotBlank(message = "Skills are required")
        String skills,

        JobStatus status

) {}
