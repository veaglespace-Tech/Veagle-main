package com.example.VeagleSpaceTech.DTO.response;

import java.util.List;

public record ServicesResponseDTO(
        Long id,
        String title,
        String description,
        String detailTitle,
        String detailDescription,
        String pageContent,
        String imageUrl,
        List<FeatureResponseDTO> features
) {
}
