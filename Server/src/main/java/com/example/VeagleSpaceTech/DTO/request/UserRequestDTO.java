package com.example.VeagleSpaceTech.DTO.request;

import com.example.VeagleSpaceTech.enums.UserStatus;

public record UserRequestDTO(
        String username,
        String email,
        String contact,
        String password,
        String role,
        UserStatus status   // optional (can be set default in backend)
) {}
