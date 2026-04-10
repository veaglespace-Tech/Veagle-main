package com.example.VeagleSpaceTech.DTO.response;


public record PortfolioResponseDTO(

        Long id,

        String title,

        String description,

        String imageUrl,

        String projectUrl,

        String githubUrl

) {}
