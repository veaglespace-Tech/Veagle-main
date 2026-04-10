package com.example.VeagleSpaceTech.DTO;

import java.time.LocalDateTime;

public record OtpData(
         String otp,
         LocalDateTime expiryTime,
         boolean verified
) {
}
