package com.example.VeagleSpaceTech.DTO.response;

import java.time.LocalDateTime;

public record PortalTaskResponseDTO(
        Long id,
        String title,
        String section,
        String priority,
        String assignedTo,
        String summary,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
