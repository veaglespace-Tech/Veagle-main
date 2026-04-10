package com.example.VeagleSpaceTech.DTO.response;

public record ClientResponseDTO(
        Long id,
        String name,
        String logoUrl,
        String websiteUrl,
        String description
) {}