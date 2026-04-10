package com.example.VeagleSpaceTech.DTO.response;


public record AuthResponse(
        Long id,
        String token,
        String role,
        String email
) {}
