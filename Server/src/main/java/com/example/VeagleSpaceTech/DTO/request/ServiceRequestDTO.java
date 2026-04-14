package com.example.VeagleSpaceTech.DTO.request;

import java.util.List;

public record ServiceRequestDTO(
        String title,
        String description,
        String detailTitle,
        String detailDescription,
        String pageContent,
        List<FeatureRequestDTO> features
) {}
