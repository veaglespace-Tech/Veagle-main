package com.example.VeagleSpaceTech.mapper;

import com.example.VeagleSpaceTech.DTO.request.ClientRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ClientResponseDTO;
import com.example.VeagleSpaceTech.entity.Client;

public class ClientMapper {

    public static Client toEntity(ClientRequestDTO dto) {
        Client c = new Client();
        c.setName(dto.name());
        c.setWebsiteUrl(dto.websiteUrl());
        c.setDescription(dto.description());
        return c;
    }

    public static ClientResponseDTO toDTO(Client c) {
        return new ClientResponseDTO(
                c.getId(),
                c.getName(),
                c.getLogoUrl(),
                c.getWebsiteUrl(),
                c.getDescription()
        );
    }
}