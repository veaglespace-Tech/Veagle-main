package com.example.VeagleSpaceTech.DTO.request;

public record PortalTaskRequestDTO(
        String title,
        String section,
        String priority,
        String assignedTo,
        String summary,
        String status
) {
}
