package com.example.VeagleSpaceTech.DTO.response;

public record ProductResponseDTO(

        Long id,
        String title,
        String description,
        String imageUrl,
        String categoryName,
        Boolean isActive

) {}
