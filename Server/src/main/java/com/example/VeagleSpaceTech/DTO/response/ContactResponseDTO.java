package com.example.VeagleSpaceTech.DTO.response;

import java.time.LocalDateTime;

public record ContactResponseDTO(

        Long id,
        String name,
        String email,
        String phone,
        String company,
        String service,
        String budget,
        String timeline,
        String message,
        boolean isRead,
        LocalDateTime createdAt

){}
