package com.example.VeagleSpaceTech.DTO.response;

import com.example.VeagleSpaceTech.enums.UserStatus;

public record UserResponseDTO(
        Long id,
        String username,
        String email,
        String contact,
        String role,
        UserStatus status
) {}
