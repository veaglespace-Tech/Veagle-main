package com.example.VeagleSpaceTech.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequestDTO (

        @NotBlank(message = "Name is required")
        String name,

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Phone is required")
        String phone,

        String company,

        String service,

        String budget,

        String timeline,

        @NotBlank(message = "Message cannot be empty")
        String message

) {}