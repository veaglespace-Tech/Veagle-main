package com.example.VeagleSpaceTech.DTO.response;

import java.time.LocalDateTime;

public record ContactResponseDTO (

    Long id,
     String name,
     String email,
     String contact,
     String subject,
     String message,
     boolean isRead,
     LocalDateTime createdAt
){}
