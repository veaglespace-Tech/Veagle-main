package com.example.VeagleSpaceTech.DTO.request;

import java.util.List;

public record ServiceRequestDTO(
        String title,
        String description,
        List<FeatureRequestDTO> features
) {}
