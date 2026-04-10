package com.example.VeagleSpaceTech.mapper;

import com.example.VeagleSpaceTech.DTO.request.PortfolioRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.PortfolioResponseDTO;
import com.example.VeagleSpaceTech.entity.Portfolio;

public class PortfolioMapper {

    // DTO → Entity
    public static Portfolio toEntity(PortfolioRequestDTO dto) {
        Portfolio p = new Portfolio();
        p.setTitle(dto.title());
        p.setDescription(dto.description());
        p.setProjectUrl(dto.projectUrl());
        p.setGithubUrl(dto.githubUrl());
        return p;
    }

    // Entity → DTO
    public static PortfolioResponseDTO toDTO(Portfolio p) {
        return new PortfolioResponseDTO(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getImageUrl(),
                p.getProjectUrl(),
                p.getGithubUrl()
        );
    }
}