package com.example.VeagleSpaceTech.DTO.request;

public record JobApplicationRequestDTO(

        String name,
        String email,
        String phone,
        String resumeUrl,
        Long jobId,
        Long userId

) {}