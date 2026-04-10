package com.example.VeagleSpaceTech.DTO.request;

public record ProductRequestDTO(

        String title,
        String description,
        String imageUrl,
        Long categoryId,
        Boolean isActive

) {}