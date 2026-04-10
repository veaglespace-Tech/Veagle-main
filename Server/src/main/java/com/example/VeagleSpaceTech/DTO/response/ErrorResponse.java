package com.example.VeagleSpaceTech.DTO.response;

import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        int status,
        LocalDateTime timestamp
) {}
