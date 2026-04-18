package com.example.VeagleSpaceTech.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Name is required")
        String username,

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Contact is required")
        @Pattern(regexp = "\\d{10}", message = "Contact must be 10 digits")
        String contact

//        @NotBlank(message = "Password is required")
//        @Size(min = 6, message = "Password must be at least 6 characters")
//        String password
) {}
