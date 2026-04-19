package com.example.VeagleSpaceTech.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordSetRequest(
        @NotBlank(message = "Password is required")
         @Size(min = 6, message = "Password must be at least 6 characters")
         String password
) {
}
