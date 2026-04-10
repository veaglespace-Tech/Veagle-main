package com.example.VeagleSpaceTech.DTO.request;

public record ClientRequestDTO(
        String name,
        String websiteUrl,
        String description,
        Integer displayOrder
) {}