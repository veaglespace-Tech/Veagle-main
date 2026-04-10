package com.example.VeagleSpaceTech.DTO.response;

import java.util.List;

public record ServicesResponseDTO(
        Long id,
        String title,
        String description,
        String imageUrl,
        List<FeatureResponseDTO> features
) {
}
