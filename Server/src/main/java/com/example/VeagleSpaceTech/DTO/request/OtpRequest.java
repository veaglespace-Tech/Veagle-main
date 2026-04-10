package com.example.VeagleSpaceTech.DTO.request;

import jakarta.validation.constraints.NotBlank;

public record OtpRequest(
        @NotBlank
        String email,
        @NotBlank
        String otp
) {}
